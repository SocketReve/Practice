/**
 * Created by socketreve on 12/11/14.
 */

angular.module("PracticeSimulator").controller("PracticePowerSetCollusionController", function($scope, $modalInstance, PracticeSETOperations, Practice) {
	$scope.trHeader = ["Nodes Coalitions"];
	$scope.table =[];

/*
	var nodes = Practice.getNodes();
	var nodesArray = [];
	//$scope.table = [];
	var powerSet;


	for(node in nodes) {
		if (nodes.hasOwnProperty(node)) {
			nodesArray.push(nodes[node]);
		}
	}

	powerSet = PracticeSETOperations.PowerSet(nodesArray);
*/
	var runTimeNodePerInstantsTable = Practice.getTableNodePerInstants();

	var nodi = [];

	for(var node in runTimeNodePerInstantsTable[0]) {
		nodi.push(node);
	}

	//console.log(runTimeNodePerInstantsTable);

	var powerSet = PracticeSETOperations.PowerSet(nodi);

	// put number of instant
	for(var i = 0; i < runTimeNodePerInstantsTable.length; i ++) {
		$scope.trHeader.push(i);
	}

	// put nodes name in first column
	var tableIndex = 0;
	for(var i = 0; i < powerSet.length; i++) {
		if(powerSet[i].length > 1) {
			if(!($scope.table[tableIndex] instanceof Array)) {
				$scope.table[tableIndex] = [];
			}
			$scope.table[tableIndex].push({ problem: false, values: powerSet[i]});
			tableIndex++;
		}
	}

	for(var i = 0; i < $scope.table.length; i++) {
		for(var j = 1; j < $scope.trHeader.length; j++) { // j = 1 because
			var test = checkCollusion($scope.table[i][0].values, j);
			$scope.table[i][j] = test;
		}
	}

/*	for(var i = 0; i < runTimeNodePerInstantsTable.length; i++) {
		$scope.table[i] = [];
		for(var j = 1; j < $scope.trHeader.length; j++) {
			$scope.table[i].push(runTimeNodePerInstantsTable[i][$scope.trHeader[j]]);
		}
	}*/

	function checkCollusion(arrayOfNodes, index) {
		index = index - 1; // because in table I have different index. index = instant

		var valuesOfNodes = [];

		for (var i = 0; i < arrayOfNodes.length; i++) {
			valuesOfNodes = valuesOfNodes.concat(runTimeNodePerInstantsTable[index][arrayOfNodes[i]].MEM.array);
		}
		//console.log(valuesOfNodes);

		// build map <from node, numberOfShares>
		var secretSharePerNodesInSubset = {};
		for(var i = 0; i < valuesOfNodes.length; i++) {
			if(valuesOfNodes[i].comType == "SS") {
				if (typeof secretSharePerNodesInSubset[valuesOfNodes[i].from] == "undefined") {
					secretSharePerNodesInSubset[valuesOfNodes[i].from] = 1;
				} else {
					secretSharePerNodesInSubset[valuesOfNodes[i].from]++;
				}
			}
		}

		//console.log(secretSharePerNodesInSubset);

		for (var actualNode in secretSharePerNodesInSubset) {
			if (runTimeNodePerInstantsTable[index][actualNode].SHARES == secretSharePerNodesInSubset[actualNode]) {
				return { problem: true, values: valuesOfNodes };
			}
		}

/*		var countShare = [] ; // count share and relative value
		for(var i = 0; i < valuesOfNodes.length; i++) {
			if(valuesOfNodes[i].comType == "SS") { // Secret Share
				if(typeof countShare[valuesOfNodes[i].value] == "undefined" || countShare[valuesOfNodes[i].value] == null) {
					countShare[valuesOfNodes[i].value] = 1
				}
				else {
					countShare[valuesOfNodes[i].value]++;
				}
			}
		}
		// check if there are some node that have same value and same number of share
		for(var node in runTimeNodePerInstantsTable[index]) {
			//console.log(runTimeNodePerInstantsTable[index][node]);
			for(var value in countShare) {
				if (runTimeNodePerInstantsTable[index][node].MEM.value == value && runTimeNodePerInstantsTable[index][node].SHARES == countShare[value]) {
					return {problem: true, values: valuesOfNodes};
				}
			}
		}*/

		return {problem: false, values: valuesOfNodes};
	}

	//$scope.table = runTimeNodePerInstantsTable;
	$scope.exit = function() {
		$modalInstance.close();
	};

	$scope.getArrayOfValue = function(array) {
		return Practice.compileMemoryToString(array);
	};
});