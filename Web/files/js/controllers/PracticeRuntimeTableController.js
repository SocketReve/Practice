/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 29/10/14.
 */

angular.module("PracticeSimulator").controller("PracticeRuntimeTableController", function($scope, $modalInstance, runTimeNodePerInstantsTable){
	$scope.trHeader = ['#'];
	$scope.table =[];

	console.log(runTimeNodePerInstantsTable);

	for(var node in runTimeNodePerInstantsTable[0]) {
		$scope.trHeader.push(node);
	}

	for(var i = 0; i < runTimeNodePerInstantsTable.length; i++) {
		$scope.table[i] = [];
		for(var j = 1; j < $scope.trHeader.length; j++) {
			$scope.table[i].push(runTimeNodePerInstantsTable[i][$scope.trHeader[j]]);
		}
	}
	//$scope.table = runTimeNodePerInstantsTable;
	$scope.exit = function() {
		$modalInstance.close();
	}
});