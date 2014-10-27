/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 22/10/14.
 */

angular.module("PracticeSimulator").factory("Practice", function($q, $interval, Graph2) {
	// template for nodes object:
/*	{
		idNode: {
			IN: {
				// nodes in input
			}
			OUT: {
				// nodes in output
			}
			TYPE: stringType
			RISK: floatRisk
			PROVIDER: stringProvider
			MEM: integerMem
		}
	}*/

	var nodes = {
		length: function() {
			var size = 0;
			var key;
			for (key in this) {
				if (this.hasOwnProperty(key)) size++;
			}
			return size - 1; // -1 because length is at the same time a property
		}
	};

	// template for instants object:
	/*{
		numInstant: [{
			IN: nameNode
			OUT: nameNode
			EDGE: nameEdge
		}];
	}*/
	var instants = {};

	// create map of function in functions:
	var mapComputationalFunctions = {};

	var maxTime = 0;
	var rawElements;

	var Practice = function() {

		mapComputationalFunctions = {
			SUM: Practice.sumCOMPOperation,
			MIN: Practice.minCOMPOperation,
			MAX: Practice.maxCOMPOperation
		};

		// converto in modo indicizzato = dizionario
		rawElements = Graph2.getElements();
		for (var i = 0; i < rawElements.nodes.length; i++) {
			nodes[rawElements.nodes[i].id] = {
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
				TYPE: rawElements.nodes[i].value.type,
				RISK: rawElements.nodes[i].value.risk,
				PROVIDER: rawElements.nodes[i].value.provider,
				MEM: rawElements.nodes[i].value.mem,
				FUNC: rawElements.nodes[i].value.func
			}
		}

		for (var i = 0; i < rawElements.edges.length; i++) {
			nodes[rawElements.edges[i].v].IN[rawElements.edges[i].u] = true;
			nodes[rawElements.edges[i].u].OUT[rawElements.edges[i].v] = true;
		}

		// calculate max time
		for(var i = 0; i < rawElements.edges.length; i++) {
			if(parseInt(rawElements.edges[i].value.label) > maxTime ) {
				maxTime = parseInt(rawElements.edges[i].value.label);
			}
		}

		// build instants object
		var j = 0;
		for(var i = 0; i < rawElements.edges.length; i++) {
			for(var k = 0; k < rawElements.edges.length; k++){
				if(parseInt(rawElements.edges[k].value.label) == j) {
					try {
						instants[j].push({
							IN: rawElements.edges[k].u,
							OUT: rawElements.edges[k].v,
							EDGE: rawElements.edges[k].id
						});
					} catch (err) { // if not present, create a new one
						instants[j] = [];
						instants[j].push({
							IN: rawElements.edges[k].u,
							OUT: rawElements.edges[k].v,
							EDGE: rawElements.edges[k].id
						});
					}
				}
			}
			j++;
		}
	};

	Practice.checkGraph = function() {
		// check COMP node have at least 2 edge ingress
		for( key in nodes ) {
			if(nodes[key].TYPE == "COMP" && nodes[key].IN.length() <= 1) {
				throw { message: "COMP node '"+ key + "' not have at least 2 input edges" };
			}
		}
		console.log(instants);
	};

	Practice.runSimulation = function() {
		var defer = $q.defer();
		var actualTimeSimulation = 0;

		// reset Highlight
		Graph2.resetHighlight();

		var interval = $interval(function() {
			// prec nodes --> no highlight
			if (actualTimeSimulation > 0) {
				for(var i = 0; i < instants[actualTimeSimulation - 1].length; i++) {
					Graph2.highlightEdge(instants[actualTimeSimulation - 1][i].EDGE, false);
					Graph2.highlightNode(instants[actualTimeSimulation - 1][i].IN, false);
					Graph2.highlightNode(instants[actualTimeSimulation - 1][i].OUT, false);
				}
			}

			for(var i = 0; i < instants[actualTimeSimulation].length; i++) {
				Graph2.highlightEdge(instants[actualTimeSimulation][i].EDGE, true);
				Graph2.highlightNode(instants[actualTimeSimulation][i].IN, true);
				Graph2.highlightNode(instants[actualTimeSimulation][i].OUT, true);
			}

			Graph2.redesign(); // I need to redesign after every modification on graph

			var mapArrayOfMemoriesOutput = {};

			// questo primo for riempe 'mapArrayOfMemoriesOutput' di tutti i valori dati dai noi ai cui archi un determinato nodo è incidente
			// dato che è trattato come un tipo 'map' = dizionario, nel caso in cui l'indice nell'oggetto sia già presente, aggiunge all'array un nuovo valore
			// in input che andrà poi successivamente calcolato con una delle funzioni disponibili. Nel caso non sia presente, crea un nuovo array e
			// ci mette il nuovo valore
			for(var i = 0; i < instants[actualTimeSimulation].length; i++) {
				try {
					mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT].push(nodes[instants[actualTimeSimulation][i].IN].MEM);
				}
				catch (err) { // if not already present, create a new one
					mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT] = [];
					mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT].push(nodes[instants[actualTimeSimulation][i].IN].MEM);
				}
			}

			// in questo ciclo for scandisco i vari nodi e, nel caso di nodo COMP, eseguo la funzione annessa.
			// per fare una cosa figa ho mappato stringa <-> valore attraverso mapComputationalFunctions
			// nel caso non sia un nodo COMP, ne conseguo che sia per forza un nodo RES pertanto metto in memoria i valori in ingresso
			for ( node in mapArrayOfMemoriesOutput ) {
				if(typeof mapComputationalFunctions[nodes[node].FUNC] == "function") { // in case of COMP node
					var result = mapComputationalFunctions[nodes[node].FUNC](mapArrayOfMemoriesOutput[node]);
					nodes[node].MEM = result; // change local mem (LOGIC)
					Graph2.changeNodeMem(node, result); // change visualisation mem (GRAPH2)
				}
				else {
					nodes[node].MEM = mapArrayOfMemoriesOutput[node][0]; // <-- RES NODE. I suppose that there are only one edge to RES node
					Graph2.changeNodeMem(node, mapArrayOfMemoriesOutput[node][0]);
				}
			}


			if(actualTimeSimulation == maxTime) {
				$interval.cancel(interval);
				defer.resolve();
			}

			actualTimeSimulation++;
		}, 1000);

		return defer.promise;
	};

	Practice.sumCOMPOperation = function(array) {
		var somma = 0;
		for(var i = 0; i < array.length; i++) {
			somma = somma + array[i];
		}
		return somma;
	};

	Practice.minCOMPOperation = function(array) {
		var minore = array[0];
		for(var i = 0; i < array.length; i++) {
			if(array[i] < minore) {
				minore = array[i];
			}
		}
		return minore;
	};

	Practice.maxCOMPOperation = function(array) {

	};

	return Practice;
});