angular.module("PracticeSimulator").controller("NetworkSimulator", function($scope, $interval, $timeout, $http, Graph2){
	// init
	$scope.nameNew = "";
	$scope.descrizioneNew = "";
	$scope.fromNew = "";
	$scope.toNew = "";
	$scope.memNew = 0;
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

	checkBackendConnection();

	var nodes = [{
		id: "nodo1",
		descr: "nodo presso aruba networks - web server",
		type: "COMP",
		provider: "aruba",
		mem: "1",
		risk: "0.5",
		func: "SUM"
	},
	{
		id: "nodo2",
		descr: "nodo presso aws ec2 - load balancing",
		type: "COMP",
		provider: "AWS",
		mem: "1",
		risk: "0.6",
		func: "SUM"
	},
	{
		id: "nodo3",
		descr: "nodo privato",
		type: "RES",
		provider: "telecom",
		mem: "1",
		risk: "0.7"
	},
	{
		id: "nodo4",
		descr: "nodo privato",
		type: "IN",
		provider: "telecom",
		mem: "1",
		risk: "0.9"
	}];

	var edges = [
	{
		u: "nodo4",
		v: "nodo1"
	},
	{
		u: "nodo1",
		v: "nodo2"
	},
	{
		u: "nodo3",
		v: "nodo1"
	},
	{
		u: "nodo1",
		v: "nodo3"
	},
	{
		u: "nodo2",
		v: "nodo1"
	}];


	// init Graph2 engine
	Graph2(nodes, edges);

		/*cy = network;

		cy.on("click",function(event){
			if(event.cyTarget === cy) {
				// background
				$("#modifier").addClass("hide");
				$("#parameters").removeClass("slideRight");
			}
			else {
				if(event.cyTarget.isNode()) {
					// if click on node ( also group )
					$scope.modifierIsNode = true;
					$scope.modifierIsEdge = false;

					$scope.nodeTypeModifier = event.cyTarget.data("type");
					$scope.nodeNameModifier = event.cyTarget.data("id");
					$scope.nodeDescriptionModifier = event.cyTarget.data("descr");
					$scope.nodeGroupModifier = event.cyTarget.data("parent");
					$scope.nodeMemModifier = event.cyTarget.data("mem");

					console.log($scope.nodeGroupModifier);

					$scope.$apply();
					$("#modifier").removeClass("hide");
				}

				else if(event.cyTarget.isEdge()) {
					// if click on edge
					$scope.modifierIsEdge = true;
					$scope.modifierIsNode = false;

					$scope.nodeFromModifier = event.cyTarget.data("source");
					$scope.nodeToModifier = event.cyTarget.data("target");

					$scope.$apply();
					$("#modifier").removeClass("hide");
				}
			}

		});*/

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
				Graph2.addEdge($scope.fromNew.trim(), $scope.toNew.trim());

				// clear input form
				$scope.fromNew = "";
				$scope.toNew = "";
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
	}

	$scope.hideParameters = function() {
		angular.element(document.getElementById("parameters")).removeClass("slideRight");
	}

	$scope.showParameters = function() {
		angular.element(document.getElementById("parameters")).addClass("slideRight");
	}

	$scope.restartVisualizer = function() {
		Graph2.resize();
	}

	// the runSimulation method have to take data from Graph2 and send (via POST request)
	// at url "/upload"
	$scope.runSimulation = function() {
		$scope.simulationRunning = true;
		$http.post("/uploadNetwork", Graph2.getElementsJSON()).success(function(data){
			$scope.simulationRunning = false;
			console.log(data);
		}).error(function(){
			$scope.simulationRunning = false;
		});
	}


	// set interval for know if backend is online
	$interval(function() {
		checkBackendConnection()
	}, 3000);

	// check if backend is online request("ping"), response("pong")
	function checkBackendConnection() {
		$http.get("/ping").success(function(data){
			if(data.status == "pong") {
				$scope.backendConnectionStyle = "green";
				$scope.statoBackend = "Backend Up"
			}
		}).error(function() {
			$scope.backendConnectionStyle = "";
			$scope.statoBackend = "Backend Down"
		});
	}

	function customAlert(message) {
		$scope.alert = true;
		$scope.alertMessage = message;

		$timeout(function() {
			$scope.alert = false;
			$scope.alertMessage = "";
		},3000);
	}
});