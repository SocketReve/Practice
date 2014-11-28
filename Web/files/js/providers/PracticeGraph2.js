/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 22/10/14.
 */

angular.module("PracticeSimulator").factory("Graph2", function($q, $timeout, $window, $sanitize) {
	var g,
		renderer,
		zoom,
		svg,
		scale = 0.85,
		scaleOnParameter = 0.8,
		layout,
		model,
		initialized = false;

	var Graph = function(nodes, edges) {
		var defer = $q.defer();
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
			defer.resolve();
			// init d3 svg
			svg = d3.select("svg");
			var centerG = svg.append("g");
			var zoomG = centerG.append("g");

			// init dagreD3
			zoom = dagreD3.zoom.panAndZoom(d3.select("svg g g"));
			renderer = new dagreD3.Renderer();

			dagreD3.zoom(svg, zoom);

			layout = dagreD3.layout()
							.nodeSep(70)
							.rankSep(100);
							//.rankDir("LR");

			g = new dagreD3.Digraph({ multigraph: true });

			// extend drawEdgePath
			var oldDrawEdgePath = renderer.drawEdgePaths();
			renderer.drawEdgePaths(function(graph, root) {
				var svgEdges = oldDrawEdgePath(graph, root);
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
					return "edgePath enter " + ((g.edge(edge).highlight) ? "green" : "") + " "+ g.edge(edge).type;
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

			// extend drawEdgeLabels
			var oldDrawEdgeLabels = renderer.drawEdgeLabels();
			renderer.drawEdgeLabels(function(graph, root) {
				var svgLabel = oldDrawEdgeLabels(graph, root);
				svgLabel.attr("id", function(edge) {
					return edge;
				});
				return svgLabel;
			});
			renderer.layout(layout);

		}); // on DOM ready

		// every second check if resize has been changed
		angular.element($window).bind("resize", function(){
			Graph.resize();
		});
		return defer.promise;
	};

	Graph.isInitialized = function() {
		return initialized;
	};

	Graph.getRawNode = function(node) {
		return g.node(node);
	};

	Graph.getRawEdge = function(edge) {
		return g.edge(edge);
	};

	Graph.getEdges = function() {
		var edgesName = g.edges();
		var edges = [];

		edgesName.forEach(function(e) {
			edges.push(	{
							id: e,
							value: g.edge(e)
						});
		});
		return edges;
	};

	Graph.getNodes = function() {
		var nodesName = g.nodes();
		var nodes = [];

		nodesName.forEach(function(u){
			nodes.push(	{
							id: u,
							value: g.node(u)
						});
		});
		return nodes;
	};

	Graph.setEdgeLabel = function(id, label) {
		g.edge(id).label = label.toString();
	};

	Graph.setEdgeType = function(id, type) {
		g.edge(id).type = type;
	};

	Graph.setNodeDescription = function(id, description) {
		var temp = g.node(id);
		g.node(id).descr = description;
		g.node(id).label = getNodeHTMLLabel(id, description, temp.type, temp.provider, temp.mem, temp.pmal, temp.func, temp.calculatedRisk);
	};

	Graph.setNodeMem = function(id, value, stringValue) {
		var temp = g.node(id);
		g.node(id).mem = parseInt(value);
		g.node(id).label = getNodeHTMLLabel(id, temp.descr, temp.type, temp.provider, stringValue, temp.pmal, temp.func, temp.calculatedRisk);
	};

	Graph.setNodeProvider = function(id, provider) {
		var temp = g.node(id);
		g.node(id).provider = provider;
		g.node(id).label = getNodeHTMLLabel(id, temp.descr, temp.type, provider, temp.mem, temp.pmal, temp.func, temp.calculatedRisk);
	};

	Graph.setNodeType = function(id, type) {
		var temp = g.node(id);
		g.node(id).type = type;
		g.node(id).label = getNodeHTMLLabel(id, temp.descr, type, temp.provider, temp.mem, temp.pmal, temp.func, temp.calculatedRisk);
	};

	Graph.setNodeFunc = function(id, func) {
		var temp = g.node(id);
		g.node(id).func = func;
		g.node(id).label = getNodeHTMLLabel(id, temp.descr, temp.type, temp.provider, temp.mem, temp.pmal, func, temp.calculatedRisk);
	};

	Graph.setNodePMAL = function(id, pmal) {
		var temp = g.node(id);
		g.node(id).pmal = parseFloat(pmal);
		g.node(id).label = getNodeHTMLLabel(id, temp.descr, temp.type, temp.provider, temp.mem, pmal, temp.func, temp.calculatedRisk);
	};

	Graph.setNodeCalculatedRisk = function(id, calculatedRisk) {
		var temp = g.node(id);
		g.node(id).calculatedRisk = parseFloat(calculatedRisk);
		g.node(id).label = getNodeHTMLLabel(id, temp.descr, temp.type, temp.provider, temp.mem, temp.pmal, temp.func, calculatedRisk);
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
	};

	Graph.addNode = function(id, description, type, provider, mem, pmal, func) {
		if(initialized == false) {
			initialized = true;
			model = renderer.run(g,d3.select("svg g g"));
		}
		try {
			g.addNode(camelCase(id.trim()), {
				labelType: "html",
				label: getNodeHTMLLabel(id, description, type, provider, mem, pmal, func, Number(0).toFixed(1)),
				descr: description,
				type: type,
				provider: provider.toUpperCase(),
				mem: parseInt(mem),
				pmal: parseFloat(pmal),
				func: func,
				calculatedRisk: Number(0).toFixed(1), // 0.0 notation
				highlight: false,
				shares: 0
			});
		} catch(err) {
			throw { message: "Node already in graph or input not valid" };
		}
	};

	Graph.addEdge = function(source, target, time, type) {
		var currentNumberOfShare = 0;

		if(type == "SS") {
			currentNumberOfShare = g.node(camelCase(source)).shares = g.node(camelCase(source)).shares + 1;
		}

		try {
			g.addEdge(camelCase(source)+"-"+camelCase(target)+"-"+time.toString()+"-"+currentNumberOfShare.toString(), camelCase(source), camelCase(target), {
				label: time.toString(),
				from: camelCase(source),
				to: camelCase(target),
				type: type,
				highlight: false,
				shareNumber: currentNumberOfShare
			});
		} catch(err) { // there is another edge with the same name
			throw { message: "Communication already in protocol or input not valid" };
		}

	};

	Graph.removeNode = function(id) {
		try {
			g.delNode(id);
		} catch(err) {
			throw { message: "Node not exists, input not valid or protocol cannot exist without nodes" };
		}
	};

	Graph.removeEdge = function(id) {
		var source = g.edge(id).from;
		var edgeType = g.edge(id).type;

		if(edgeType == "SS") {
			g.node(camelCase(source)).shares = g.node(camelCase(source)).shares - 1;
		}
		try {
			g.delEdge(id);
		} catch(err) {
			throw { message: "Communication not exist" };
		}
	};

	Graph.redesign = function() {
		renderer.transition(function (selection) {
			return selection.transition().duration(500);
		});
		model = renderer.run(g, d3.select("svg g g"));
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
			//var factorScale = (graphWidth * 1.5 > width) ? 3 :
			var zoomScale = Math.min(width / graphWidth * scaleOnParameter, height / graphHeight * scaleOnParameter);
			var parametersWidth = document.getElementById("parameters").offsetWidth;
			translate = [parametersWidth + 20, (height / 2) - ((graphHeight * zoomScale) / 2)];
		}

		zoom.translate(translate);
		zoom.scale(zoomScale);
		zoom.event(svg.transition().duration(500));
	};

	Graph.highlightEdge = function(edge, activate) {
		if(activate == true) {
			g.edge(edge).highlight = true;
		}
		else {
			g.edge(edge).highlight = false;
		}
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
		g.nodes().forEach(function(u){
			g.node(u).highlight = false;
		});

		g.edges().forEach(function(e){
			g.edge(e).highlight = false;
		});
	};

	function getNodeHTMLLabel(id, description, type, provider, mem, pmal, func, calculatedRisk) {
		var htmlTemplate =	"<div class='customNode'>";
				htmlTemplate +=	"<span class='type "+ $sanitize(type) +"'> </span>";
				htmlTemplate += "<span class='calcRisk'> "+ $sanitize(calculatedRisk) +" </span>";
				htmlTemplate +=	"<span class='name'>"+ camelCase($sanitize(id)) +"</span>";
				htmlTemplate +=	"<span class='description'>"+ $sanitize(description) +"</span>";
				htmlTemplate +=	"<span class='provider'>"+ $sanitize(provider.toUpperCase()) +"</span>";
				htmlTemplate +=	"<span class='mem'>"+ $sanitize(mem)+ ((type == "COMP") ? (" | " + $sanitize(func)) : '' )+"</span>"; // I KNOW! -- SORRY :D
				htmlTemplate +=	"<span class='pmal'>"+ $sanitize(pmal) +"</span>";
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
