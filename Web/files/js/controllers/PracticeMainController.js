/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 03/10/14.
 */

angular.module("PracticeSimulator").controller("PracticeMainController", function($scope, $modal, $interval, $timeout, $q, Graph2, Practice, PracticeCOMPFunctions){
	// init scope var
	$scope.nameNew = "";
	$scope.descrizioneNew = "";
	$scope.fromNew = "";
	$scope.toNew = "";
	$scope.memNew = 0;
	$scope.timeNew = 0;
	$scope.riskNew = 0.1;
	$scope.groupOfNodeNew = "";
	$scope.newGroupName = "";
	$scope.nodeGroupModifier = "";
	$scope.nodeTypeNew = "IN";
	$scope.edgeTypeNew = "PT";
	$scope.numberOfSecret = 1;
	$scope.nodeTypeModifier = "COMP";
	$scope.nodeFuncModifier = "";
	$scope.nodeNameModifier = "";
	$scope.nodeMemModifier = 0;
	$scope.nodeRiskModifier = 0.1;
	$scope.nodeDescriptionModifier = "";
	$scope.edgeIdModifier = "";
	$scope.edgeLabelModifier = 0;
	$scope.edgeTypeModifier = "";
	$scope.simulationRunning = false;
	$scope.simulationStepRunning = false;
	$scope.funcOfCompNode = [];
	$scope.alert = false;

/*	var nodes = [{
		id: "nodo1",
		descr: "--",
		type: "IN",
		provider: "--",
		mem: "1",
		risk: "0.5"
	},{
		id: "nodo2",
		descr: "--",
		type: "IN",
		provider: "--",
		mem: "3",
		risk: "0.5"
	},{
		id: "nodo3",
		descr: "--",
		type: "IN",
		provider: "--",
		mem: "1",
		risk: "0.5"
	},{
		id: "nodo4",
		descr: "--",
		type: "IN",
		provider: "--",
		mem: "7",
		risk: "0.5"
	},{
		id: "nodo5",
		descr: "--",
		type: "IN",
		provider: "--",
		mem: "3",
		risk: "0.5"
	},{
		id: "nodo6",
		descr: "--",
		type: "IN",
		provider: "--",
		mem: "5",
		risk: "0.5"
	},{
		id: "comp1",
		descr: "--",
		type: "COMP",
		provider: "--",
		mem: "0",
		risk: "0.5",
		func: "SUM"
	},{
		id: "comp2",
		descr: "--",
		type: "COMP",
		provider: "--",
		mem: "0",
		risk: "0.5",
		func: "SUM"
	},{
		id: "comp3",
		descr: "--",
		type: "COMP",
		provider: "--",
		mem: "0",
		risk: "0.5",
		func: "SUM"
	},{
		id: "comp4",
		descr: "--",
		type: "COMP",
		provider: "--",
		mem: "0",
		risk: "0.5",
		func: "MIN"
	},{
		id: "res",
		descr: "--",
		type: "RES",
		provider: "--",
		mem: "0",
		risk: "0.5"
	}];

	var edges = [{
		u: "nodo1",
		v: "comp1",
		time: 0
	},{
		u: "nodo2",
		v: "comp1",
		time: 1
	},{
		u: "nodo3",
		v: "comp2",
		time: 1
	},{
		u: "nodo4",
		v: "comp2",
		time: 2
	},{
		u: "nodo5",
		v: "comp3",
		time: 1
	},{
		u: "nodo6",
		v: "comp3",
		time: 2
	},{
		u: "comp1",
		v: "comp4",
		time: 2
	},{
		u: "comp2",
		v: "comp4",
		time: 2
	},{
		u: "comp3",
		v: "comp4",
		time: 4
	},{
		u: "comp4",
		v: "res",
		time: 5
	}];*/

	// init funcOfCompNode
	for(var type in PracticeCOMPFunctions) {
		$scope.funcOfCompNode.push(type);
	}

/*	// init Graph2 engine
	Graph2(nodes, edges).then(function(){
		bindCustomEvents();
	});*/

	bindCustomEvents();

/*
	$scope.addNode = function() {
		if(Graph2.isInitialized() == false) {
			var nodes = [{
				id: $scope.nameNew.trim(),
				value: {
					descr: $scope.descrizioneNew.trim(),
					type: $scope.nodeTypeNew,
					provider: $scope.providerNodeNew.trim(),
					mem: parseInt($scope.memNew),
					risk: parseFloat($scope.riskNew),
					func: $scope.nodeFunctionNew,
					highlight: false
				}
			}];

			Graph2(nodes, []).then(function(){
				bindCustomEvents();
			});

			// clear input form
			$scope.nameNew = "";
			$scope.descrizioneNew = "";
			$scope.providerNodeNew = "";
			$scope.memNew = 0;
			$scope.riskNew = 0.1;

		}
		else {
			if ($scope.nameNew.trim() != "" && $scope.descrizioneNew.trim() != "" && $scope.providerNodeNew.trim() != "") {
				try {
					Graph2.addNode($scope.nameNew.trim(), $scope.descrizioneNew.trim(), $scope.nodeTypeNew, $scope.providerNodeNew.trim(), $scope.memNew, $scope.riskNew, $scope.nodeFunctionNew);

					// clear input form
					$scope.nameNew = "";
					$scope.descrizioneNew = "";
					$scope.providerNodeNew = "";
					$scope.memNew = 0;
					$scope.riskNew = 0.1;
					bindCustomEvents();
				}
				catch (err) {
					customAlert(err);
				}
			}
			else {
				customAlert("Not compiled all input form");
			}
		}
	};
*/
	$scope.addNode = function() {
		if ($scope.nameNew.trim() != "" && $scope.descrizioneNew.trim() != "" && $scope.providerNodeNew.trim() != "") {
			if (Graph2.isInitialized() == false) {
				Graph2().then(function () {
					try {
						Graph2.addNode($scope.nameNew.trim(), $scope.descrizioneNew.trim(), $scope.nodeTypeNew, $scope.providerNodeNew.trim(), $scope.memNew, $scope.riskNew, $scope.nodeFunctionNew);

						// clear input form
						$scope.nameNew = "";
						$scope.descrizioneNew = "";
						$scope.providerNodeNew = "";
						$scope.memNew = 0;
						$scope.riskNew = 0.1;

						Graph2.redesign();
						$timeout(function(){
							bindCustomEvents();
							Graph2.scale("parameters");
						},500);
					}
					catch (err) {
						customAlert(err);
					}
				});
			} else {
				try {
					Graph2.addNode($scope.nameNew.trim(), $scope.descrizioneNew.trim(), $scope.nodeTypeNew, $scope.providerNodeNew.trim(), $scope.memNew, $scope.riskNew, $scope.nodeFunctionNew);

					// clear input form
					$scope.nameNew = "";
					$scope.descrizioneNew = "";
					$scope.providerNodeNew = "";
					$scope.memNew = 0;
					$scope.riskNew = 0.1;

					Graph2.redesign();
					$timeout(function(){
						bindCustomEvents();
						Graph2.scale("parameters");
					},500);
				}
				catch (err) {
					customAlert(err);
				}
			}
		}
		else {
			customAlert("Not compiled all input form");
		}
	};


	$scope.addCommunication = function() {
		if($scope.fromNew.trim() != "" && $scope.toNew.trim() != "" && $scope.numberOfSecret != 0) {
			try {
				for(var i = 1; i <= $scope.numberOfSecret; i++) {
					Graph2.addEdge($scope.fromNew.trim(), $scope.toNew.trim(), $scope.timeNew, $scope.edgeTypeNew, i);
				}

				// clear input form
				$scope.fromNew = "";
				$scope.toNew = "";
				$scope.timeNew = 0;

				Graph2.redesign();
				$timeout(function(){
					bindCustomEvents();
					Graph2.scale("parameters");
				},500);

			}
			catch(err) {
				customAlert(err);
			}
		}
		else {
			customAlert("Not compiled all input form");
		}
	};

	$scope.showModifier = function(condition) {
		if(condition == true) {
			angular.element(document.getElementById("modifier")).removeClass("hide");
		}
		else {
			angular.element(document.getElementById("modifier")).addClass("hide");
		}
	};

	$scope.showParameters = function(condition) {
		if(condition == true) {
			angular.element(document.getElementById("parameters")).addClass("slideRight");
			if(Graph2.isInitialized()) {
				$timeout(function() { // wait until parameters div is open
					Graph2.scale("parameters");
				},300);
			}
		}
		else {
			if(angular.element(document.getElementById("parameters")).hasClass("slideRight")) {
				angular.element(document.getElementById("parameters")).removeClass("slideRight");
				if(Graph2.isInitialized()) {
					Graph2.scale("original");
				}
			}
		}
	};

	$scope.resetZoom = function() {
		Graph2.resize();
	};

	$scope.reloadPage = function() {
		location.reload();
	};

	$scope.downloadGraph = function($event) {
		try {
			var elements = angular.copy({ nodes: Graph2.getNodes(), edges: Graph2.getEdges() });
			// clean nodes from html label
			for(var i = 0; i < elements.nodes.length; i++) {
				delete elements.nodes[i].value.label;
				delete elements.nodes[i].value.labelType;
			}
			var json = JSON.stringify(elements);
			var blob = new Blob([json], {type: "application/json"});
			var url = URL.createObjectURL(blob);

			$event.target.download = "graph.json";
			$event.target.href = url;
		} catch(err) {
			customAlert({ message: "Graph Empty" })
		}
	};

	$scope.uploadGraph = function() {
		var input = document.querySelector("input");
		input.click();

		input.onchange = function() {
			var file = input.files[0];
			var reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function(e) {
				var graphObj = JSON.parse(e.target.result);
				// init Graph2 engine
				Graph2().then(function () {
					try {
						for(var i = 0; i < graphObj.nodes.length; i++) {
							Graph2.addNode(graphObj.nodes[i].id, graphObj.nodes[i].value.descr, graphObj.nodes[i].value.type, graphObj.nodes[i].value.provider, graphObj.nodes[i].value.mem, graphObj.nodes[i].value.risk, graphObj.nodes[i].value.func);
						}
						for(var i = 0; i < graphObj.edges.length; i++) {
							Graph2.addEdge(graphObj.edges[i].value.from, graphObj.edges[i].value.to, graphObj.edges[i].value.label, graphObj.edges[i].value.type, graphObj.edges[i].value.currentNumberOfSecret);
						}


						Graph2.redesign();
						$timeout(function(){
							bindCustomEvents();
							Graph2.resize();
						},500);

					}
					catch (err) {
						customAlert(err);
					}
				});
			};
			// reset every running simulation
			$scope.simulationRunning = false;
			$scope.simulationStepRunning = false;
		};
	};

	$scope.isGraphInitialized = function() {
		return Graph2.isInitialized();
	};

	$scope.checkGraph = function() {
		if(Graph2.isInitialized()) {
			try {
				Practice();
				Practice.checkGraph();
				customAlert({ type: "success", message: "Everything OK" })
			}
			catch (err) {
				customAlert(err);
			}
		}
		else {
			customAlert({ message: "Graph not initialized" })
		}
	};

	$scope.runSimulation = function() {
		try {
			Graph2.resize();
			Practice();
			Practice.checkGraph();


			var modalInstance = $modal.open({
				templateUrl: 'partial/ModalVisualizationModePartial.htm',
				size: "sm",
				controller: function($scope, $modalInstance) {
					$scope.isCollapsed = true;
					$scope.type = "step";
					$scope.interval = 500;

					$scope.select = function() {
						$modalInstance.close({ type: $scope.type, intervalTime: $scope.interval });
					}
				}
			});

			modalInstance.result.then(function(selected){
				if(selected.type == "auto") {
					$scope.simulationRunning = true;
					Practice.runIntervalSimulation(selected.intervalTime).then(function(){
						$scope.simulationRunning = false;
					});
				}
				else if(selected.type == "step") {
					Practice.runStepSimulation();
					$scope.simulationStepRunning = true;
				}

			},function() {
				console.log("dismiss");
			});
		}
		catch (err) {
			$scope.simulationRunning = false;
			customAlert(err);
		}
	};

	$scope.simulationStep = function() {
		/*// rebuild table simulation table
		var temp = Practice.getNodes();
		runtimeTable.push(temp);*/

		if(Practice.simulationStep()  == false) {
			$scope.simulationStepRunning = false;
		}
	};

	$scope.generateRuntimeTable = function() {
		var modalInstance = $modal.open({
			templateUrl: 'partial/ModalRuntimeTablePartial.htm',
			controller: "PracticeRuntimeTableController",
			size: "lg",
			resolve: {
				runTimeNodePerInstantsTable: function () {
					return Practice.getTableNodePerInstants();
				}
			}
		});

		modalInstance.result.then(function (result) {
		}, function () {
			console.log('Chart Modal dismissed at: ' + new Date());
		});
	};

	$scope.generatePowerSet = function() {
		var modalInstance = $modal.open({
			templateUrl: 'partial/ModalChartPartial.htm',
			controller: "PracticeChartsController",
			size: "lg",
			windowClass: "modalChart"
		});

		modalInstance.result.then(function (result) {
		}, function () {
			console.log('Chart Modal dismissed at: ' + new Date());
		});
	};

	$scope.saveModifications = function() {
		if($scope.modifierIsNode) {
			try {
				if ($scope.nodeDescriptionModifier.trim() != "" && $scope.nodeGroupModifier.trim() != "" && $scope.nodeGroupModifier.trim() != "" && $scope.nodeTypeModifier.trim() != "") {
					Graph2.setNodeDescription($scope.nodeNameModifier, $scope.nodeDescriptionModifier);
					Graph2.setNodeProvider($scope.nodeNameModifier, $scope.nodeGroupModifier);
					Graph2.setNodeType($scope.nodeNameModifier, $scope.nodeTypeModifier);
					Graph2.setNodeFunc($scope.nodeNameModifier, $scope.nodeFuncModifier);
					Graph2.setNodeMem($scope.nodeNameModifier, $scope.nodeMemModifier);
					Graph2.setNodeRisk($scope.nodeNameModifier, $scope.nodeRiskModifier);
				}
			} catch (err) {
				console.log(err);
				customAlert({ message: "Input not valid in node" });
			}
		} else if ($scope.modifierIsEdge) {
			Graph2.setEdgeLabel($scope.edgeIdModifier, $scope.edgeLabelModifier);
			Graph2.setEdgeType($scope.edgeIdModifier, $scope.edgeTypeModifier);
		}

		Graph2.redesign();
	};

	$scope.removeElement = function() {
		if($scope.modifierIsNode) {
			try {
				Graph2.removeNode($scope.nodeNameModifier);
			}
			catch(err) {
				customAlert(err);
			}
		}
		else {
			try {
				Graph2.removeEdge($scope.edgeIdModifier);
			}
			catch(err) {
				customAlert(err);
			}
		}

		Graph2.redesign();
		$timeout(function(){
			bindCustomEvents();
			Graph2.resize();
		},500);

		$scope.showModifier(false);
	};

	function customAlert(message) {
		console.log(message);
		$scope.alert = true;
		$scope.alertMessage = message.message;

		if(message.type == "success") {
			$scope.alertType = "success";
		}
		else {
			$scope.alertType = "danger";
		}

		$timeout(function() {
			$scope.alert = false;
			$scope.alertMessage = "";
		},3000);
	};

	function bindCustomEvents() {
		// init events on node
		var nodesEvents = document.getElementsByClassName("node");

		for(var i = 0; i < nodesEvents.length; i++) {
			angular.element(nodesEvents[i]).off().on("click", function() { // rebind
				$scope.modifierIsNode = true;
				$scope.modifierIsEdge = false;

				$scope.showModifier(true);

				var node = Graph2.getRawNode(this.id);
				$scope.nodeTypeModifier = node.type;
				$scope.nodeFuncModifier = node.func;
				$scope.nodeNameModifier = this.id;
				$scope.nodeDescriptionModifier = node.descr;
				$scope.nodeGroupModifier = node.provider;
				console.log(node);
				$scope.nodeMemModifier = node.mem;
				$scope.nodeRiskModifier = node.risk;
			});
		}

		// init events on edges
		var edgesEvents = document.getElementsByClassName("edgeLabel");

		for(var i = 0; i < edgesEvents.length; i++) {
			angular.element(edgesEvents[i]).off().on("click", function() {
				$scope.modifierIsNode = false;
				$scope.modifierIsEdge = true;

				$scope.showModifier(true);

				var edge = Graph2.getRawEdge(this.id);

				$scope.edgeIdModifier = this.id;
				$scope.edgeLabelModifier = parseInt(edge.label);
				$scope.edgeTypeModifier = edge.type;
			});
		}

		// bind escape key for remove modifier div
		angular.element(document).off("keyup"); // rebind
		angular.element(document).on("keyup", function(e){
			if(e.keyCode == 27) {
				$scope.showParameters(false);
				$scope.showModifier(false);
			}
			else if(e.keyCode == 83 && $scope.simulationStepRunning == true) { // key 's'
				$scope.simulationStep();
				$scope.$apply();
			}
			else if(e.keyCode == 84 && ($scope.simulationRunning == true || $scope.simulationStepRunning == true)) { // key 't'
				$scope.generateRuntimeTable();
			}
		});
	};
});