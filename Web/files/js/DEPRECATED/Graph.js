// specification with cytoscape -- deprecated 16/10/2014
angular.module("PracticeSimulator").factory("Graph", function($q) {
	var cy;
	var numOfEdges = 0;
	var Graph = function(nodes, edges){
		var deferred = $q.defer();

		// put nodes model in cy.js
		var eles = [];
		var edgesArr = [];

		// type of shapes mapped
		var shapes = {
			COMP: "octagon",
			IN: "ellipse",
			RES: "rectangle"
		};

		var color = {
			COMP: "#1f77b4",
		}

		numOfEdges = edges.length; // numero di archi iniziali

		for ( var i = 0; i < nodes.length; i++ ){

			// in case of undefined resource, means that the node is a provider
			var localShape = (shapes[nodes[i].type] != undefined ) ? shapes[nodes[i].type] : "ellipse";
			console.log(localShape);

			eles.push({
				group: "nodes",
				data: {
					id: nodes[i].id,
					descr: nodes[i].descr,
					type: nodes[i].type,
					parent: nodes[i].provider,
					mem: nodes[i].mem,
					shape: localShape
				},
				position: { x: Math.floor((Math.random() * $(window).width())+1), y: Math.floor((Math.random() * $(window).height())+1) }
			});
		}

		for ( var i = 0; i < edges.length; i++ ){
			edgesArr.push({
				group: "edges",
				data: {
					id: i.toString(),
					source: edges[i].source,
					target: edges[i].target
				}
			});
		}
	
		$(function(){ // on dom ready
			cy = cytoscape({
			container: $("#network")[0],
			
			style: cytoscape.stylesheet()
			.selector("node")
				.css({
					"shape":"data(shape)",
					"content": "data(id)",
					"text-valign": "center",
					"text-halign": "center"
				 })
			.selector('edge')
				.css({
					"content": "data(id)",
					"target-arrow-shape": "triangle"
				})
			.selector(":selected")
				.css({
					"background-color": "blue",
					"line-color": "blue",
					"target-arrow-color": "blue",
					"source-arrow-color": "blue",
					"text-outline-color": "blue"
				})
			.selector("$node > node")
				.css({
					"padding-top": "10px",
					"padding-left": "10px",
					"padding-bottom": "10px",
					"padding-right": "10px",
					"text-valign": "top",
					"text-halign": "center",
					"background-color": "#F6F4F6"
				}),

			layout: {
				name: "circle",
				padding: 30
			},
			
			elements: { nodes: eles, edges: edgesArr },

			ready: function(){
				deferred.resolve(this);
				/*cy.on('cxtdrag', 'node', function(e){
					var node = this;
					var dy = Math.abs( e.cyPosition.x - node.position().x );
					var weight = Math.round( dy*2 );
					
					node.data('weight', weight);
					
					fire('onWeightChange', [ node.id(), node.data('weight') ]);
				});*/
				}
			});

		}); // on dom ready
		return deferred.promise;
	};

	Graph.addNode = function(idNew, descriptionNew, nodeType, groupOfNode) {
		// check if there is already the group
		/*if(cy.nodes().parent("#"+groupNew).length == 0) {
			console.log("sono qui2")
			this.addGroup(groupNew, groupDescription);
		}*/
		cy.add({ 
			group: "nodes",
			data: {
				id: idNew, 
				descr: descriptionNew,
				type: nodeType,
				parent: groupOfNode,
				shape: shapes[nodeType]
			}
		});
		cy.layout({
			name: "circle",
			padding: 30
		});
		cy.center();
	};

	Graph.addEdge = function(idSource, idTarget) {
		cy.add({
			group: "edges",
			data: {
				id: numOfEdges.toString(),
				source: idSource,
				target: idTarget
			}
		});
		// incremento lo step temporale
		numOfEdges = numOfEdges + 1;
		cy.center();
	};

	Graph.addGroup = function(groupName, groupDescription) {
		cy.add({
			group: "nodes",
			data: {
				id: groupName,
				descr: groupDescription
			}
		});
		cy.center();
	};

	Graph.removeNode = function(name) {
		cy.remove("#"+name);
		cy.center();
	}

	Graph.reset = function() {
		cy.layout({
			name: "circle",
			padding: 30
		});
		cy.center();	
	}


	/*Graph.listeners = {};

	function fire(e, args){
		var listeners = Graph.listeners[e];
		
		for( var i = 0; listeners && i < listeners.length; i++ ){
			var fn = listeners[i];
			fn.apply( fn, args );
		}
	}

	function listen(e, fn){
		var listeners = Graph.listeners[e] = Graph.listeners[e] || [];

		listeners.push(fn);
	}

	Graph.setPersonWeight = function(id, weight){
		cy.$('#' + id).data('weight', weight);
	};

	Graph.onWeightChange = function(fn){
		listen('onWeightChange', fn);
	};*/

	return Graph;

});
