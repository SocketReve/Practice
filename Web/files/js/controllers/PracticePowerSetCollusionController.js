/**
 * Created by socketreve on 12/11/14.
 */

angular.module("PracticeSimulator").controller("PracticePowerSetCollusionController", function($q, $scope, $sce, $modalInstance, DTColumnBuilder, DTOptionsBuilder, PracticeSETOperations, Practice) {
	$scope.trHeader = ["Nodes Coalitions"];
	$scope.table =[];

	$scope.dtColumns = [
		DTColumnBuilder.newColumn("nodes").withTitle("Nodes Coalitions")
	];

	var elements = [];
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
		$scope.dtColumns.push(DTColumnBuilder.newColumn(i.toString()).withTitle(i.toString()).renderWith(function(data, type, full) {
			return (full.problem) ? "<span class='Collusion'>"+ data + "</span>" : data;
		}));
	}


	for(var i = 0; i < powerSet.length; i++) {
		if (powerSet[i].length > 1) {
			var element = {};
			element["nodes"] = powerSet[i].toString();
			for(var j = 0; j < $scope.dtColumns.length - 1; j++) { //
				var test = checkCollusion(powerSet[i],j);
				element[j.toString()] = Practice.compileMemoryToString(test.values);
				element["problem"] = test.problem;
			}
			elements.push(element);
		}
	}

	$scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
		return $q(function(resolve, reject) {
			resolve(elements);
		});
	}).withDisplayLength(100).withOption("autoWidth", false);

/*	// put nodes name in first column
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
	}*/

	//

/*	for(var i = 0; i < runTimeNodePerInstantsTable.length; i++) {
		$scope.table[i] = [];
		for(var j = 1; j < $scope.trHeader.length; j++) {
			$scope.table[i].push(runTimeNodePerInstantsTable[i][$scope.trHeader[j]]);
		}
	}*/

	function checkCollusion(arrayOfNodes, index) {
		var valuesOfNodes = [];

		var plainTextInfoPerNode = {},
			totalPlainText = 0;

		for (var i = 0; i < arrayOfNodes.length; i++) {
			valuesOfNodes = valuesOfNodes.concat(runTimeNodePerInstantsTable[index][arrayOfNodes[i]].MEM.array);

			for(var j = 0; j < runTimeNodePerInstantsTable[index][arrayOfNodes[i]].MEM.array.length; j++) {
				if(runTimeNodePerInstantsTable[index][arrayOfNodes[i]].MEM.array[j].comType == "PT") {
					totalPlainText ++;
					if (typeof plainTextInfoPerNode[arrayOfNodes[i]] == "undefined") {
						plainTextInfoPerNode[arrayOfNodes[i]] = 1;
					} else {
						plainTextInfoPerNode[arrayOfNodes[i]] ++;
					}
				}
			}
		}
		// check plain text. if more of what user need there is a problem
		for(var t = 0; t < arrayOfNodes.length; t++) {
			if(totalPlainText > plainTextInfoPerNode[arrayOfNodes[t]]) {
				return { problem: true, values: valuesOfNodes };
			}
		}

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

		// check secret share

		for (var actualNode in secretSharePerNodesInSubset) {
			if (runTimeNodePerInstantsTable[index][actualNode].SHARES == secretSharePerNodesInSubset[actualNode]){
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
		return $sce.trustAsHtml(Practice.compileMemoryToString(array));
	};
});