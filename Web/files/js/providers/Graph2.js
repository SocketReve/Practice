/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 22/10/14.
 */

angular.module("PracticeSimulator").factory("Graph2", function($q, $timeout, $window, $sanitize) {
	var g,
		renderer,
		zoom,
		svg,
		scale = 0.9,
		scaleOnParameter = 0.8,
		layout,
		model;

	var Graph = function(nodes, edges) {
		/*
		 	nodes template:

			{
				id: "id",
				descr: "descr",
				type: "type",
				provider: "provider",
				mem: memoryInstantZero,
				risk: risk,
				func: "func"
			}
		 */

		/*
			edges template:

			{
				u: "u",
				v: "v",
			}
		 */

		// on DOM ready
		angular.element(document).ready(function(){
			// init d3 svg
			svg = d3.select("svg");
			centerG = svg.append("g");
			zoomG = centerG.append("g");

			// init dagreD3
			zoom = dagreD3.zoom.panAndZoom(d3.select("svg g g"));
			renderer = new dagreD3.Renderer();

			dagreD3.zoom(svg, zoom);
			//zoom.scale(scale).event(svg);

			layout = dagreD3.layout()
							.nodeSep(70)
							.rankSep(120)
							.rankDir("LR");

			g = new dagreD3.Digraph({ multigraph: true});

			// extend drawEdgesPath
			var oldDrawEdgesPath = renderer.drawEdgePaths();
			renderer.drawEdgePaths(function(graph, root) {
				var svgEdges = oldDrawEdgesPath(graph, root);
				var splitedLabel;
				svgEdges.attr("time", function(edge) {
					var splitedLabel = edge.split('-');
					return splitedLabel[2];
				});
				svgEdges.attr("from", function(edge) {
					var splitedLabel = edge.split('-');
					return splitedLabel[0];
				});
				svgEdges.attr("to", function(edge) {
					var splitedLabel = edge.split('-');
					return splitedLabel[1];
				});
				return svgEdges;
			});

			// init nodes
			for(var i = 0; i < nodes.length; i++) {
				var htmlTemplate =	"<div class='customNode' id='"+ camelCase($sanitize(nodes[i].id)) +"'>";
						htmlTemplate +=	"<span class='type "+ $sanitize(nodes[i].type) +"'> </span>";
						htmlTemplate +=	"<span class='name'>"+ camelCase($sanitize(nodes[i].id)) +"</span>";
						htmlTemplate +=	"<span class='description'>"+ $sanitize(nodes[i].descr) +"</span>";
						htmlTemplate +=	"<span class='provider'> "+ $sanitize(nodes[i].provider.toUpperCase()) +"</span>";
						htmlTemplate +=	"<span class='mem'>"+ $sanitize(nodes[i].mem) + ((nodes[i].type == "COMP") ? (" | " + $sanitize(nodes[i].func)) : '' )+"</span>";
						htmlTemplate +=	"<span class='risk'>"+ $sanitize(nodes[i].risk) +"</span>";
					htmlTemplate +=	"</div>";

				g.addNode(camelCase(nodes[i].id.trim()), {
					labelType: "html",
					label: htmlTemplate,
					descr: nodes[i].descr,
					type: nodes[i].type,
					provider: nodes[i].provider.toUpperCase(),
					mem: parseInt(nodes[i].mem),
					risk: parseFloat(nodes[i].risk)
				});
			}

			for(var i = 0; i < edges.length; i++) {
				g.addEdge(camelCase(edges[i].u) +"-"+ camelCase(edges[i].v) +"-"+ edges[i].time.toString(), edges[i].u, edges[i].v, {
					label: edges[i].time.toString()
				});
			}

			renderer.layout(layout);
			model = renderer.run(g,d3.select("svg g g"));

			Graph.resize();
		}); // on DOM ready

		// every second check if resize has been changed
		angular.element($window).bind("resize", function(){
			Graph.resize();
		});
	};

	Graph.resize = function() {
		// allineo al centro

		var graphWidth = model.graph().width + 5;
		var graphHeight = model.graph().height + 5;
		var width = parseInt(svg.style('width').replace(/px/, ''));
		var height = parseInt(svg.style('height').replace(/px/, ''));
		var zoomScale = Math.min(width / graphWidth*scale, height / graphHeight*scale);
		var translate = [(width/2) - ((graphWidth*zoomScale)/2)+10, (height/2) - ((graphHeight*zoomScale)/2)];

		zoom.translate(translate);
		zoom.scale(zoomScale);
		zoom.event(svg.transition().duration(500));
	}

	Graph.addNode = function(id, description, type, provider, mem, risk, func) {
		try {
			var htmlTemplate =	"<div class='customNode'>";
					htmlTemplate +=	"<span class='type "+ $sanitize(type) +"'> </span>";
					htmlTemplate +=	"<span class='name'>"+ camelCase($sanitize(id)) +"</span>";
					htmlTemplate +=	"<span class='description'>"+ $sanitize(description) +"</span>";
					htmlTemplate +=	"<span class='provider'>"+ $sanitize(provider.toUpperCase()) +"</span>";
					htmlTemplate +=	"<span class='mem'>"+ $sanitize(mem)+ ((type == "COMP") ? (" | " + $sanitize(func)) : '' )+"</span>"; // I KNOW! -- SORRY :D
					htmlTemplate +=	"<span class='risk'>"+ $sanitize(risk) +"</span>";
				htmlTemplate +=	"</div>";

			g.addNode(camelCase(id.trim()), {
				labelType: "html",
				label: htmlTemplate,
				descr: description,
				type: type,
				provider: provider.toUpperCase(),
				mem: parseInt(mem),
				risk: parseFloat(risk),
				func: func
			});
		} catch(err) {
			throw "Node already in graph or input not valid";
		}

		this.redesign();

		$timeout(function(){
			Graph.scale("parameters");
		},500);
	};

	Graph.addEdge = function(source, target, time) {
		try {
			g.addEdge(camelCase(source)+"-"+camelCase(target)+"-"+time.toString(), camelCase(source), camelCase(target), {
				label: time.toString()
			});
		} catch(err) {
			throw "Edge is already in the graph or input not valid";
		}

		this.redesign();
		/*$timeout(function(){
			Graph.resize();
		},500);*/
	};

	Graph.removeNode = function(id) {
		try {
			g.delNode(id);
		} catch(err) {
			throw "Node not exists or input not valid";
		}
		this.redesign();
/*
		$timeout(function(){
			Graph.resize();
		},500);
*/
	};

	Graph.removeEdge = function(id) {
		try {
			g.delEdge(id);
		} catch(err) {
			throw "Communication not exists";
		}
		this.redesign();
/*
		$timeout(function(){
			Graph.resize();
		},500);
*/
	};

	Graph.redesign = function() {
		renderer.transition(function (selection) {
			return selection.transition().duration(500);
		});

		model = renderer.run(g, d3.select("svg g g"));
	};

	Graph.getElements = function() {
		// delete useless information for simulation
		var object = dagreD3.json.encode(g);

		for(var i = 0; i < object.nodes.length; i++) {
			delete object.nodes[i].value["label"];
			delete object.nodes[i].value["labelType"];
		}
		delete object.type;

		return object;
	};

	Graph.scale = function(scaleMod) {
		var translate;
		var graphWidth = model.graph().width + 5;
		var graphHeight = model.graph().height + 5;
		var width = parseInt(svg.style('width').replace(/px/, ''));
		var height = parseInt(svg.style('height').replace(/px/, ''));

		if (scaleMod == "original") {
			var zoomScale = Math.min(width / graphWidth * scale, height / graphHeight * scale);
			translate = [(width/2) - ((graphWidth*zoomScale)/2)+10, (height/2) - ((graphHeight*zoomScale)/2)];
		}
		else if (scaleMod == "parameters") {
			var zoomScale = Math.min(width / graphWidth * scaleOnParameter, height / graphHeight * scaleOnParameter);
			translate = [(graphWidth / 3), (height / 2) - ((graphHeight * zoomScale) / 2)];
		}

		zoom.translate(translate);
		zoom.scale(zoomScale);
		zoom.event(svg.transition().duration(500));
	};

	Graph.highlightByTime = function(time, activate) {
		var edges = document.querySelectorAll(".edgePath[time='" + time.toString() + "']");

		for (var i = 0; i < edges.length; i++) {
			var element = angular.element(edges[i]);
			if(activate == true) {
				element.addClass("green");
				this.highlightNode(element.attr("to"), activate);
				this.highlightNode(element.attr("from"), activate);
			}
			else {
				element.removeClass("green");
				this.highlightNode(element.attr("from"), activate);
				this.highlightNode(element.attr("to"), activate);
			}
		}
	};

	Graph.highlightNode = function(node, activate) {
		var nodeSelected = angular.element(document.getElementById(node));
		var parent = nodeSelected.parent().parent().parent().parent();
		var rect = angular.element(parent[0].firstElementChild);

		if(activate == true) {
			angular.element(parent[0].firstElementChild).addClass("green");
		}
		else {
			angular.element(parent[0].firstElementChild).removeClass("green");
		}
	};

	Graph.resetHighlight = function() {
		var nodes = document.querySelectorAll("rect");
		var edges = document.querySelectorAll(".edgePath");

		for(var i = 0; i < nodes.length; i++) {
			angular.element(nodes[i]).removeClass("green");
		}

		for(var i = 0; i < edges.length; i++) {
			angular.element(edges[i]).removeClass("green");
		}
	}

	// transform id with camel case typo
	function camelCase(input) {
		return input.replace(/ (.)/g, function(match, group1) {
			return group1.toUpperCase();
		});
	}

	return Graph;
});
