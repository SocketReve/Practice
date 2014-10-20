angular.module("PracticeSimulator").factory("Graph2", function($q, $timeout, $window) {
	var g,
		renderer,
		zoom,
		svg,
		scale = 0.9,
		layout,
		model;

	// step temporale
	var edgesCount = 1;

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

			// init nodes
			for(var i = 0; i < nodes.length; i++) {
				var htmlTemplate =	"<div class='customNode'>";
						htmlTemplate +=	"<span class='type "+ nodes[i].type +"'> </span>";
						htmlTemplate +=	"<span class='name'>"+ camelCase(nodes[i].id) +"</span>";
						htmlTemplate +=	"<span class='description'>"+ nodes[i].descr +"</span>";
						htmlTemplate +=	"<span class='provider'> "+ nodes[i].provider.toUpperCase() +"</span>";
						htmlTemplate +=	"<span class='mem'>"+ nodes[i].mem + ((nodes[i].type == "COMP") ? (" | " + nodes[i].func) : '' )+"</span>";
						htmlTemplate +=	"<span class='risk'>"+ nodes[i].risk +"</span>";
					htmlTemplate +=	"</div>";

				g.addNode(camelCase(nodes[i].id.trim()), {
					labelType: "html",
					label: htmlTemplate,
					descr: nodes[i].descr,
					type: nodes[i].type,
					provider: nodes[i].provider,
					mem: parseInt(nodes[i].mem),
					risk: parseFloat(nodes[i].risk)
				});
			}

			for(var i = 0; i < edges.length; i++) {
				g.addEdge(edgesCount, edges[i].u, edges[i].v, {
					label: edgesCount.toString()
				});
				edgesCount++;
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
					htmlTemplate +=	"<span class='type "+ type +"'> </span>";
					htmlTemplate +=	"<span class='name'>"+ camelCase(id) +"</span>";
					htmlTemplate +=	"<span class='description'>"+ description +"</span>";
					htmlTemplate +=	"<span class='provider'>"+ provider.toUpperCase() +"</span>";
					// I KNOW! -- SORRY :D
					htmlTemplate +=	"<span class='mem'>"+ mem + ((type == "COMP") ? (" | " + func) : '' )+"</span>";
					htmlTemplate +=	"<span class='risk'>"+ risk +"</span>";
				htmlTemplate +=	"</div>";

			g.addNode(camelCase(id.trim()), {
				labelType: "html",
				label: htmlTemplate,
				descr: description,
				type: type,
				provider: provider,
				mem: parseInt(mem),
				risk: parseFloat(risk),
				func: func
			});
		} catch(err) {
			throw "Node already in graph";
		}

		this.redesign();
		$timeout(function(){
			Graph.resize();
		},500);
	};

	Graph.addEdge = function(source, target) {
		try {
			g.addEdge(edgesCount, camelCase(source), camelCase(target), {
				label: edgesCount.toString()
			});
			edgesCount++;
		} catch(err) {
			throw "Edge is already in the graph";
		}

		this.redesign();
		$timeout(function(){
			Graph.resize();
		},500);
	};

	Graph.removeNode = function(id) {
		try {
			g.delNode(id);
		} catch(err) {
			throw "Node not exists";
		}
		this.redesign();
		$timeout(function(){
			Graph.resize();
		},500);
	};

	Graph.removeEdge = function(id) {
		try {
			g.delEdge(id);
		} catch(err) {
			throw "Communication not exists";
		}
		this.redesign();
		$timeout(function(){
			Graph.resize();
		},500);
	};

	Graph.redesign = function() {
		renderer.transition(function (selection) {
			return selection.transition().duration(500);
		});

		model = renderer.run(g, d3.select("svg g g"));
	};

	Graph.getElementsJSON = function() {
		// delete useless information
		var object = dagreD3.json.encode(g);

		for(var i = 0; i < object.nodes.length; i++) {
			delete object.nodes[i].value["label"];
			delete object.nodes[i].value["labelType"];
		}
		delete object.type;

		return JSON.stringify(object);
	};

	// transform id with camel case typo
	function camelCase(input) {
		return input.replace(/ (.)/g, function(match, group1) {
			return group1.toUpperCase();
		});
	}

	return Graph;
});
