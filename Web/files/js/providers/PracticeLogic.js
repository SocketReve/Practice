/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 22/10/14.
 */

angular.module("PracticeSimulator").factory("Practice", function($q, $interval, Graph2) {
	var nodes = {};
	var rawElements;

	var Practice = function(elements) {
		// converto in modo indicizzato = dizionario
		rawElements = elements;

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
	};

	Practice.checkGraph = function() {
		// check COMP node have at least 2 edge ingress
		for( key in nodes ) {
			if(nodes[key].TYPE == "COMP" && nodes[key].IN.length() <= 1) {
				throw "COMP node '"+ nodes[key].ID + "' not have at least 2 input edges";
			}
		}
	};

	Practice.runSimulation = function() {
		var defer = $q.defer();
		// max time
		var maxTime = 0;
		var actualTimeSimulation = 0;

		for(var i = 0; i < rawElements.edges.length; i++) {
			if(parseInt(rawElements.edges[i].value.label) > maxTime ) {
				maxTime = parseInt(rawElements.edges[i].value.label);
			}
		}

		// reset Highlight
		Graph2.resetHighlight();

		var interval = $interval(function() {
			// prec nodes --> no highlight
			if (actualTimeSimulation > 0) {
				Graph2.highlightByTime(actualTimeSimulation-1, false);
			}

			// actual nodes --> highlight
			Graph2.highlightByTime(actualTimeSimulation, true);

			if(actualTimeSimulation == maxTime) {
				$interval.cancel(interval);
				defer.resolve();
			}

			actualTimeSimulation++;
		}, 1500);

		return defer.promise;
	};

	Practice.sumCOMPOperation = function(array) {

	};

	Practice.minCOMPOperation = function(array) {

	};

	Practice.maxCOMPOperation = function(array) {

	};

	return Practice;
});