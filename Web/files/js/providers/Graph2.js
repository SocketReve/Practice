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

			layout = dagreD3.layout()
							.nodeSep(70)
							.rankSep(120)
							.rankDir("LR");

			g = new dagreD3.Digraph({ multigraph: true });

			// extend drawEdgesPath
			var oldDrawEdgesPath = renderer.drawEdgePaths();
			renderer.drawEdgePaths(function(graph, root) {
				var svgEdges = oldDrawEdgesPath(graph, root);
				svgEdges.attr("id", function(edge){
					return edge;
				});
				svgEdges.attr("time", function(edge) {
					return g.edge(edge).label;
				});
				svgEdges.attr("from", function(edge) {
					return g.edge(edge).from;
				});
				svgEdges.attr("to", function(edge) {
					return g.edge(edge).to;
				});
				svgEdges.attr("class", function(edge) {
					return "edgePath enter " + ((g.edge(edge).highlight) ? "green" : "");
				});

				return svgEdges;
			});
			// extend drawNodes
			var oldDrawNodes = renderer.drawNodes();
			renderer.drawNodes(function(graph, root){
				var svgNodes = oldDrawNodes(graph,root);
				svgNodes.attr("id", function(u) {
					return u;
				});
				svgNodes.select("rect").attr("class",function(u) {
					return ((g.node(u).highlight) ? "green" : "");
				});
				return svgNodes;
			});

			// init nodes
			for(var i = 0; i < nodes.length; i++) {
				g.addNode(camelCase(nodes[i].id.trim()), {
					labelType: "html",
					label: getNodeHTMLLabel(nodes[i].id, nodes[i].descr, nodes[i].type, nodes[i].provider, nodes[i].mem, nodes[i].risk, nodes[i].func),
					descr: nodes[i].descr,
					type: nodes[i].type,
					provider: nodes[i].provider.toUpperCase(),
					mem: parseInt(nodes[i].mem),
					risk: parseFloat(nodes[i].risk),
					func: nodes[i].func,
					highlight: false
				});
			}

			for(var i = 0; i < edges.length; i++) {
				g.addEdge(camelCase(edges[i].u) +"-"+ camelCase(edges[i].v) +"-"+ edges[i].time.toString(), edges[i].u, edges[i].v, {
					label: edges[i].time.toString(),
					from: camelCase(edges[i].u),
					to: camelCase(edges[i].v),
					highlight: false
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
			g.addNode(camelCase(id.trim()), {
				labelType: "html",
				label: getNodeHTMLLabel(id, description, type, provider, mem, risk, func),
				descr: description,
				type: type,
				provider: provider.toUpperCase(),
				mem: parseInt(mem),
				risk: parseFloat(risk),
				func: func,
				highlight: false
			});
		} catch(err) {
			throw { message: "Node already in graph or input not valid" };
		}

		this.redesign();

		$timeout(function(){
			Graph.scale("parameters");
		},500);
	};

	Graph.addEdge = function(source, target, time) {
		try {
			g.addEdge(camelCase(source)+"-"+camelCase(target)+"-"+time.toString(), camelCase(source), camelCase(target), {
				label: time.toString(),
				from: camelCase(source),
				to: camelCase(target),
				highlight: false
			});
		} catch(err) {
			throw { message: "Edge is already in the graph or input not valid" };
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
			throw { message: "Node not exists or input not valid" };
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
			throw { message: "Communication not exists" };
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
		return dagreD3.json.encode(g);
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

/*	Graph.highlightByTime = function(time, activate) {
		var edges = document.querySelectorAll(".edgePath[time='" + time.toString() + "']");

		for (var i = 0; i < edges.length; i++) {
			this.highlightEdge(edges[i], activate);
			this.highlightNode(edges[i].getAttribute("to"), activate);
			this.highlightNode(edges[i].getAttribute("from"), activate);
		}
	};*/

	Graph.highlightEdge = function(edge, activate) {
		if(activate == true) {
			g.edge(edge).highlight = true;
		}
		else {
			g.edge(edge).highlight = false;
		}

/*		// if is edge already element --> transform
		if(typeof edge != "string") {
			var edgeSelected = angular.element(edge);
		}
		else {
			var edgeSelected = angular.element(document.getElementById(edge));
		}

		if(activate == true) {
			edgeSelected.addClass("green");
		}
		else {
			edgeSelected.removeClass("green");
		}*/
	};

	Graph.highlightNode = function(node, activate) {
		if(activate == true) {
			g.node(node).highlight = true;
		}
		else {
			g.node(node).highlight = false;
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
	};

/*	Graph.getNodeValue = function(id, value) {
		return g.node(id)[value];
	}*/

	Graph.changeNodeMem = function(id, mem) {
		var temp = g.node(id);
		g.node(id).label = getNodeHTMLLabel(id, temp.descr, temp.type, temp.provider, mem, temp.risk, temp.func);
		this.redesign();
	};

	function getNodeHTMLLabel(id, description, type, provider, mem, risk, func) {
		var htmlTemplate =	"<div class='customNode'>";
				htmlTemplate +=	"<span class='type "+ $sanitize(type) +"'> </span>";
				htmlTemplate +=	"<span class='name'>"+ camelCase($sanitize(id)) +"</span>";
				htmlTemplate +=	"<span class='description'>"+ $sanitize(description) +"</span>";
				htmlTemplate +=	"<span class='provider'>"+ $sanitize(provider.toUpperCase()) +"</span>";
				htmlTemplate +=	"<span class='mem'>"+ $sanitize(mem)+ ((type == "COMP") ? (" | " + $sanitize(func)) : '' )+"</span>"; // I KNOW! -- SORRY :D
				htmlTemplate +=	"<span class='risk'>"+ $sanitize(risk) +"</span>";
			htmlTemplate +=	"</div>";
		return htmlTemplate;
	}

	// transform id with camel case typo
	function camelCase(input) {
		return input.replace(/ (.)/g, function(match, group1) {
			return group1.toUpperCase();
		});
	}

	return Graph;
});
