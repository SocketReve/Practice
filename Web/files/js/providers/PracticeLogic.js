/**
 * Created by socketreve on 22/10/14.
 */

angular.module("PracticeSimulator").factory("Practice", function($q) {
	var nodes = {};
	var rawElements;
	var defer = $q.defer();


	var Practice = function(elements) {
		// converto in modo indicizzato = dizionario
		rawElements = elements;

		console.log(elements);

		for (var i = 0; i < elements.nodes.length; i++) {
			nodes[elements.nodes[i].id] = {
				ID: elements.nodes[i].id,
				IN: {
					length: function() {
						var size = 0;
						var key;
						for (key in this) {
							if (this.hasOwnProperty(key)) size++;
						}
						return size - 1; // -1 because length is at the same time a property
					}
				},
				OUT: {
					length: function() {
						var size = 0;
						var key;
						for (key in this) {
							if (this.hasOwnProperty(key)) size++;
						}
						return size - 1; // -1 because length is at the same time a property
					}
				},
				TYPE: elements.nodes[i].value.type,
				RISK: elements.nodes[i].value.risk,
				PROVIDER: elements.nodes[i].value.provider,
				MEM: elements.nodes[i].value.mem
			}
		}

		for (var i = 0; i < elements.edges.length; i++) {
			nodes[elements.edges[i].v].IN[elements.edges[i].u] = true;
			nodes[elements.edges[i].u].OUT[elements.edges[i].v] = true;
		}

		console.log(nodes);
	};

	Practice.checkGraph = function() {
		// check COMP node have at least 2 edge ingress

		console.log(nodes["nodo2"].IN.length());
		for( key in nodes ) {
			if(nodes[key].TYPE == "COMP" && nodes[key].IN.length() <= 1) {
				throw "COMP node '"+ nodes[key].ID + "' not have at least 2 nodes ingress";
			}
		}
	};

	Practice.runSimulation = function() {
		defer.resolve();
		return defer.promise();
	};

	return Practice;
});