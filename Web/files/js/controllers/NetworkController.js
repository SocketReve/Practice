/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 03/10/14.
 */

angular.module("PracticeSimulator").controller("NetworkSimulator", function($scope, $modal, $interval, $timeout, Graph2, Practice){
	// init
	$scope.nameNew = "";
	$scope.descrizioneNew = "";
	$scope.fromNew = "";
	$scope.toNew = "";
	$scope.memNew = 0;
	$scope.timeNew = 0;
	$scope.riskNew = 0.1;
	$scope.groupOfNodeNew = "";
	$scope.removeNodeName = "";
	$scope.newGroupName = "";
	$scope.newGroupDescription = "";
	$scope.nodeTypeNew = "IN";
	$scope.nodeTypeModifier = "COMP";
	$scope.nodeIDModifier = "";
	$scope.nodeDescriptionModifier = "";
	$scope.nodeFromModifier = "";
	$scope.nodeToModifier = "";
	$scope.nodeGroupModifier = "";
	$scope.simulationRunning = false;
	$scope.statoBackend = "Backend Down";
	$scope.alert = false;

	//checkBackendConnection();

	var nodes = [{
		id: "nodo1",
		descr: "nodo presso aruba networks ",
		type: "IN",
		provider: "aruba",
		mem: "1",
		risk: "0.5"
	},
	{
		id: "nodo2",
		descr: "nodo presso aws ec2",
		type: "IN",
		provider: "AWS",
		mem: "2",
		risk: "0.6"
	},
	{
		id: "nodo3",
		descr: "nodo computazionale di somma",
		type: "COMP",
		provider: "telecom",
		mem: "0",
		risk: "0.7",
		func: "SUM"
	},
	{
		id: "nodo4",
		descr: "nodo di risoluzione",
		type: "RES",
		provider: "telecom",
		mem: "0",
		risk: "0.9"
	},
	{
		id: "nodo5",
		descr: "nodo di risoluzione",
		type: "IN",
		provider: "VULTR",
		mem: "2",
		risk: "0.9"
	},
	{
		id: "nodo6",
		descr: "nodo di risoluzione",
		type: "COMP",
		provider: "VULTR",
		mem: "0",
		risk: "0.9",
		func: "SUM"
	},
	{
		id: "nodo7",
		descr: "nodo di risoluzione",
		type: "RES",
		provider: "ARUBA",
		mem: "0",
		risk: "0.9"
	}];

	var edges = [
	{
		u: "nodo1",
		v: "nodo3",
		time: 0
	},
	{
		u: "nodo2",
		v: "nodo3",
		time: 0
	},
	{
		u: "nodo5",
		v: "nodo3",
		time: 0
	},
	{
		u: "nodo3",
		v: "nodo6",
		time: 1
	},
	/*{
		u: "nodo6",
		v: "nodo3",
		time: 2
	},*/
	{
		u: "nodo3",
		v: "nodo4",
		time: 2
	},
	{
		u: "nodo3",
		v: "nodo7",
		time: 3
	},
	{
		u: "nodo6",
		v: "nodo7",
		time: 4
	},
	{
		u: "nodo5",
		v: "nodo6",
		time: 0
	}];


	// init Graph2 engine
	Graph2(nodes, edges);

	// events for modify Graph2
	$scope.addNode = function() {
		if($scope.nameNew.trim() != "" && $scope.descrizioneNew.trim() != "" && $scope.providerNodeNew.trim() != "")  {
			try {
				Graph2.addNode($scope.nameNew.trim(), $scope.descrizioneNew.trim(), $scope.nodeTypeNew, $scope.providerNodeNew.trim(), $scope.memNew, $scope.riskNew, $scope.nodeFunctionNew);

				// clear input form
				$scope.nameNew = "";
				$scope.descrizioneNew = "";
				$scope.providerNodeNew = "";
				$scope.memNew = 0;
				$scope.riskNew = 0.1;
			}
			catch(err) {
				customAlert(err);
			}
		}
		else {
			customAlert("Not compiled all input form");
		}
	};

	$scope.addCommunication = function() {
		if($scope.fromNew.trim() != "" && $scope.toNew.trim() != "") {
			try {
				Graph2.addEdge($scope.fromNew.trim(), $scope.toNew.trim(), $scope.timeNew);

				// clear input form
				$scope.fromNew = "";
				$scope.toNew = "";
				$scope.timeNew = 0;
			}
			catch(err) {
				customAlert(err);
			}
		}
		else {
			customAlert("Not compiled all input form");
		}
	}

	$scope.removeNode = function() {
		if($scope.removeNodeName.trim() != "") {
			try {
				Graph2.removeNode($scope.removeNodeName.trim());
				// clear input form
				$scope.removeNodeName = "";
			}
			catch(err) {
				customAlert(err);
			}
		}
		else {
			customAlert("Not compiled all input form");
		}
	};

	$scope.removeEdge = function() {
		if($scope.removeComName.trim() != "") {
			try {
				Graph2.removeEdge($scope.removeComName.trim());
				$scope.removeComName = "";
			}
			catch(err) {
				customAlert(err);
			}
		}
		else {
			customAlert("Not compiled all input form");
		}
	};

	// events for dom
	$scope.hideModifier = function() {
		angular.element(document.getElementById("modifier")).addClass("hide");
	};

	$scope.hideParameters = function() {
		if(angular.element(document.getElementById("parameters")).hasClass("slideRight")) {
			angular.element(document.getElementById("parameters")).removeClass("slideRight");
			Graph2.scale("original");
		}
	};

	$scope.showParameters = function() {
		angular.element(document.getElementById("parameters")).addClass("slideRight");
		Graph2.scale("parameters");
	};

	$scope.restartVisualizer = function() {
		Graph2.resize();
	};

	$scope.runSimulation = function() {
		Graph2.resize();

		try {
			$scope.simulationRunning = true;

			Practice();
			Practice.checkGraph();
			Practice.runSimulation().then(function(){
				$scope.simulationRunning = false;
			});

		}
		catch (err) {
			$scope.simulationRunning = false;
			customAlert(err);
		}
	};

	$scope.generateCharts = function() {
		var modalInstance = $modal.open({
			templateUrl: 'modalCharts.html',
			size: "lg",
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
	};

	function customAlert(message) {
		console.log(message);
		$scope.alert = true;
		$scope.alertMessage = message.message;

		$timeout(function() {
			$scope.alert = false;
			$scope.alertMessage = "";
		},3000);
	}
});