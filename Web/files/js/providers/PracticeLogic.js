/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 22/10/14.
 */

angular.module("PracticeSimulator").factory("Practice", function($q, $interval, Graph2, PracticeCOMPFunctions) {
	var memoryTypeToTemplate = {
		"PT": [' ',' '], // PLAIN TEXT
		"SS": ['[',']'], // SECRET SHARE OPEN AND CLOSE
		"CR": ['{','}'], // CRYPTED
		"GC": ['', '*'] // CIRCUIT GARBLED
	};
	// factory scope
	var nodes, instants, maxTime, rawElements, interval, actualTimeSimulation, matrixNodePerInstants;

	var Practice = function() {
		maxTime = 0;

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
				 FUNC: stringFunc
			 }
		 }*/

		nodes = {};

		// template for instants object:
		/*{
		 numInstant: [{
				 IN: nameNode
				 OUT: nameNode
				 EDGE: nameEdge
			 }];
		 }*/
		instants = {};

		// in this matrix (table) there are nodes in every instants. this can permit to build runtime table
		matrixNodePerInstants = [];

		// converto in modo indicizzato = dizionario
		rawElements = { nodes: Graph2.getNodes(), edges: Graph2.getEdges() };

		for (var i = 0; i < rawElements.nodes.length; i++) {
			nodes[rawElements.nodes[i].id] = {
				ID: rawElements.nodes[i].id, // i need it for power set
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
				/*MEM: (rawElements.nodes[i].value.type == "COMP" || rawElements.nodes[i].value.type == "RES") ? [] : [rawElements.nodes[i].value.mem],*/
				MEM: {
					//array: (rawElements.nodes[i].value.type == "COMP" || rawElements.nodes[i].value.type == "RES") ? [] : [rawElements.nodes[i].value.mem],
					array: (rawElements.nodes[i].value.type == "COMP" || rawElements.nodes[i].value.type == "RES") ? [] : [{value: rawElements.nodes[i].value.mem, comType: null}],
					value: rawElements.nodes[i].value.mem
				},
				FUNC: rawElements.nodes[i].value.func
			}
		}

		for (var i = 0; i < rawElements.edges.length; i++) {
			nodes[rawElements.edges[i].value.to].IN[rawElements.edges[i].value.from] = true;
			nodes[rawElements.edges[i].value.from].OUT[rawElements.edges[i].value.to] = true;
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
							IN: rawElements.edges[k].value.from,
							OUT: rawElements.edges[k].value.to,
							COMTYPE: rawElements.edges[k].value.type,
							EDGE: rawElements.edges[k].id
						});
					} catch (err) { // if not present, create a new one
						instants[j] = [];
						instants[j].push({
							IN: rawElements.edges[k].value.from,
							OUT: rawElements.edges[k].value.to,
							COMTYPE: rawElements.edges[k].value.type,
							EDGE: rawElements.edges[k].id
						});
					}
				}
			}
			j++;
		}
	};

	Practice.getNodes = function() {
		return nodes;
	};

	Practice.getInstants = function() {
		return instants;
	};

	Practice.getTableNodePerInstants = function() {
		return matrixNodePerInstants;
	};

	/*Practice.getMapArrayOfMemoriesOutput = function() {
		return mapArrayOfMemoriesOutput;
	}*/

	Practice.checkGraph = function() {
		for( key in nodes ) {
			if(nodes[key].TYPE == "COMP" && nodes[key].IN.length() <= 1) { // check that COMP nodes have at least 2 edge ingress
				throw { message: "COMP node '"+ key + "' not have at least 2 input from 2 different nodes" };
			}
			if(nodes[key].TYPE == "RES" && nodes[key].OUT.length() > 0) { // check that RES nodes doesn't have exit edge
				throw { message: "RES node '"+ key + "' can't have any exit communication" };
			}
			if(nodes[key].TYPE == "IN" && nodes[key].IN.length() > 0) { // check that IN nodes doesn't have input edge
				throw { message: "IN node '"+ key + "' can't have any input edges" };
			}
		}
	};

	Practice.runIntervalSimulation = function(intervalTime) {
		var defer = $q.defer();
		actualTimeSimulation = 0;

		// reset Highlight
		Graph2.resetHighlight();

		interval = $interval(function() {
			Practice.simulationStep(defer);
		}, intervalTime);

		return defer.promise;
	};

	Practice.runStepSimulation = function() {
		actualTimeSimulation = 0;

		// reset Highlight
		Graph2.resetHighlight();

		Practice.simulationStep();
	};

	Practice.simulationStep = function(defer) {
		try {
			// prec nodes --> no highlight
			if (actualTimeSimulation > 0) {
				for (var i = 0; i < instants[actualTimeSimulation - 1].length; i++) {
					Graph2.highlightEdge(instants[actualTimeSimulation - 1][i].EDGE, false);
					Graph2.highlightNode(instants[actualTimeSimulation - 1][i].IN, false);
					Graph2.highlightNode(instants[actualTimeSimulation - 1][i].OUT, false);
				}
			}
		} catch (err) {
			console.log("SIMULATION TIMER: Time step missing in de-highlighting")
		}
		try {
			for (var i = 0; i < instants[actualTimeSimulation].length; i++) {
				Graph2.highlightEdge(instants[actualTimeSimulation][i].EDGE, true);
				Graph2.highlightNode(instants[actualTimeSimulation][i].IN, true);
				Graph2.highlightNode(instants[actualTimeSimulation][i].OUT, true);
			}

			// calcoli
			var mapArrayOfMemoriesOutput = {};

			// questo primo for riempe 'mapArrayOfMemoriesOutput' di tutti i valori dati dai noi ai cui archi un determinato nodo è incidente
			// dato che è trattato come un tipo 'map' = dizionario, nel caso in cui l'indice nell'oggetto sia già presente, aggiunge all'array un nuovo valore
			// in input che andrà poi successivamente calcolato con una delle funzioni disponibili. Nel caso non sia presente, crea un nuovo array e
			// ci mette il nuovo valore
			for (var i = 0; i < instants[actualTimeSimulation].length; i++) {
				try {
					mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT].push({ value: nodes[instants[actualTimeSimulation][i].IN].MEM.value, comType: instants[actualTimeSimulation][i].COMTYPE });
					//mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT] = mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT].concat(nodes[instants[actualTimeSimulation][i].IN].MEM.array);

				}
				catch (err) { // if not already present, create a new one
					mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT] = [];
					mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT].push({ value: nodes[instants[actualTimeSimulation][i].IN].MEM.value, comType: instants[actualTimeSimulation][i].COMTYPE });
					//mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT] = mapArrayOfMemoriesOutput[instants[actualTimeSimulation][i].OUT].concat(nodes[instants[actualTimeSimulation][i].IN].MEM.array);
				}
			}

			//console.log(mapArrayOfMemoriesOutput);

			// in questo ciclo for scandisco i vari nodi e, nel caso di nodo COMP, eseguo la funzione annessa.
			// per fare una cosa figa ho mappato stringa <-> valore attraverso mapComputationalFunctions
			// nel caso non sia un nodo COMP, ne conseguo che sia per forza un nodo RES pertanto metto in memoria i valori in ingresso
			for (var node in mapArrayOfMemoriesOutput) {
				nodes[node].MEM.array = nodes[node].MEM.array.concat(mapArrayOfMemoriesOutput[node]); // change local mem (LOGIC)

				if (typeof PracticeCOMPFunctions[nodes[node].FUNC] == "function") { // in case of COMP node --> FUNC exist
					nodes[node].MEM.value = PracticeCOMPFunctions[nodes[node].FUNC](nodes[node].MEM.array.map(function(item) { return item.value } )); // inline conversion from object to array of values
					Graph2.setNodeMem(node, nodes[node].MEM.value,compileMemoryToString(nodes[node].MEM.array)); // change visualisation mem (GRAPH2)
				}
				else { // in case of RES
					Graph2.setNodeMem(node, 0,compileMemoryToString(nodes[node].MEM.array));
				}
			}
			Graph2.redesign(); // I need to redesign after every modification on graph

		} catch (err) {
			console.log(err);
			console.log("SIMULATION TIMER: Time step missing")
		}

		matrixNodePerInstants.push(angular.copy(nodes));

		if (actualTimeSimulation == maxTime+1) {
			$interval.cancel(interval);
			if(typeof defer != "undefined") {
				defer.resolve();
			}
			else {
				return false;
			}
		}

		actualTimeSimulation++;
	};

	function compileMemoryToString(mem) {
		console.log(mem);
		var compiledMem = "";
		for(var i = 0; i < mem.length; i++) {
			compiledMem += memoryTypeToTemplate[mem[i].comType][0] + mem[i].value.toString() + memoryTypeToTemplate[mem[i].comType][1];
		}
		return compiledMem;
	}

	return Practice;
});