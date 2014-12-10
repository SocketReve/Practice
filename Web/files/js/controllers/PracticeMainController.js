/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 03/10/14.
 */

angular.module("PracticeSimulator").controller("PracticeMainController", function($scope, $modal, $interval, $timeout, $q, Graph2, Practice, PracticeCOMPFunctions, PracticeShapley){
	// init scope var
	$scope.nameNew = "";
	$scope.descrizioneNew = "";
	$scope.fromNew = "";
	$scope.toNew = "";
	$scope.memNew = 0;
	$scope.timeNew = 0;
	$scope.maliciousProbabilityNew = 0.1;
	$scope.providerNodeNew = "";
	$scope.groupOfNodeNew = "";
	$scope.newGroupName = "";
	$scope.nodeGroupModifier = "";
	$scope.nodeTypeNew = "IN";
	$scope.edgeTypeNew = "PT";
	//$scope.numberOfSecret = 1;
	$scope.nodeTypeModifier = "COMP";
	$scope.nodeFuncModifier = "";
	$scope.nodeFunctionNew = "";
	$scope.nodeNameModifier = "";
	$scope.nodeMemModifier = 0;
	$scope.nodeMaliciousProbabilityModifier = 0.1;
	$scope.nodeDescriptionModifier = "";
	$scope.edgeIdModifier = "";
	$scope.edgeLabelModifier = 0;
	$scope.edgeTypeModifier = "";
	$scope.simulationRunning = false;
	$scope.simulationStepRunning = false;
	$scope.funcOfCompNode = [];
	$scope.alert = false;


	// init funcOfCompNode
	for(var type in PracticeCOMPFunctions) {
		$scope.funcOfCompNode.push(type);
	}


	bindCustomEvents();

	$scope.addNode = function() {
		if ($scope.nameNew.trim() != "" && $scope.descrizioneNew.trim() != "" && $scope.providerNodeNew.trim() != "") {
			if (Graph2.isInitialized() == false) {
				new Graph2().then(function () {
					try {
						Graph2.addNode($scope.nameNew.trim(), $scope.descrizioneNew.trim(), $scope.nodeTypeNew, $scope.providerNodeNew.trim(), $scope.memNew, $scope.maliciousProbabilityNew, $scope.nodeFunctionNew, 0);

						// clear input form
						$scope.nameNew = "";
						$scope.descrizioneNew = "";
						$scope.providerNodeNew = "";
						$scope.memNew = 0;
						$scope.maliciousProbabilityNew = 0.1;

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
					Graph2.addNode($scope.nameNew.trim(), $scope.descrizioneNew.trim(), $scope.nodeTypeNew, $scope.providerNodeNew.trim(), $scope.memNew, $scope.maliciousProbabilityNew, $scope.nodeFunctionNew, 0);

					// clear input form
					$scope.nameNew = "";
					$scope.descrizioneNew = "";
					$scope.providerNodeNew = "";
					$scope.memNew = 0;
					$scope.maliciousProbabilityNew = 0.1;

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
		if($scope.fromNew.trim() != "" && $scope.toNew.trim() != "" /*&& $scope.numberOfSecret != 0*/) {
			try {
				Graph2.addEdge($scope.fromNew.trim(), $scope.toNew.trim(), $scope.timeNew, $scope.edgeTypeNew, 0);
/*
				for(var i = 1; i <= $scope.numberOfSecret; i++) {
					Graph2.addEdge($scope.fromNew.trim(), $scope.toNew.trim(), $scope.timeNew, $scope.edgeTypeNew);
				}
*/

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
				new Graph2().then(function () {
					try {
						for(var i = 0; i < graphObj.nodes.length; i++) {
							Graph2.addNode(graphObj.nodes[i].id, graphObj.nodes[i].value.descr, graphObj.nodes[i].value.type, graphObj.nodes[i].value.provider, graphObj.nodes[i].value.mem, graphObj.nodes[i].value.pmal, graphObj.nodes[i].value.func, graphObj.nodes[i].value.shares);
						}
						for(var i = 0; i < graphObj.edges.length; i++) {
							Graph2.addEdge(graphObj.edges[i].value.from, graphObj.edges[i].value.to, graphObj.edges[i].value.label, graphObj.edges[i].value.type, graphObj.edges[i].value.shareNumber);
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
			new Practice();
			try {
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
			new Practice();
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

	$scope.estimateRisk = function() {
		new Practice();
		var nodes = PracticeShapley(Practice.getNodes());
		for(var i = 0; i < nodes.length; i++) {
			Graph2.setNodeCalculatedRisk(nodes[i].id, nodes[i].risk);
		}
		Graph2.redesign();
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
			windowClass: "modalRuntimeTable"
		});

		modalInstance.result.then(function (result) {
		}, function () {
			console.log('Chart Modal dismissed at: ' + new Date());
		});
	};

	$scope.generatePowerSetTable = function() {
		var modalInstance = $modal.open({
			templateUrl: 'partial/ModalPowerSetCollusionPartial.htm',
				controller: "PracticePowerSetCollusionController",
			size: "lg",
			windowClass: "modalPowerSetCollusion"
		});

		modalInstance.result.then(function (result) {
		}, function () {
			console.log('Chart Modal dismissed at: ' + new Date());
		});
	};

	$scope.generateChart = function() {
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
					Graph2.setNodePMAL($scope.nodeNameModifier, $scope.nodeMaliciousProbabilityModifier);
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
				$scope.nodeMaliciousProbabilityModifier = node.pmal;
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
		angular.element(document).off("keydown"); // rebind
		angular.element(document).on("keydown", function(e){
			console.log(e);
			if(e.keyCode == 27) {
				$scope.showParameters(false);
				$scope.showModifier(false);
			}
			else if(e.keyCode == 73 && e.metaKey) { // key cmd+'i' == thesis simulator
				$scope.showParameters(true);

				var json = {
					"nodes": [{
						"id": "I1",
						"value": {
							"descr": "fornitore di asfalto",
							"type": "IN",
							"provider": "-",
							"mem": 100,
							"pmal": 0.8,
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 2
						}
					}, {
						"id": "I2",
						"value": {
							"descr": "fornitore di attrezzi",
							"type": "IN",
							"provider": "-",
							"mem": 50,
							"pmal": 0.8,
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 2
						}
					}, {
						"id": "I3",
						"value": {
							"descr": "fornitore di macchine utensili",
							"type": "IN",
							"provider": "-",
							"mem": 20,
							"pmal": 0.9,
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 2
						}
					}, {
						"id": "I4",
						"value": {
							"descr": "fornitore di asfalto",
							"type": "IN",
							"provider": "-",
							"mem": 95,
							"pmal": 0.7,
							"func": "",
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 2
						}
					}, {
						"id": "I5",
						"value": {
							"descr": "fornitore di attrezzi",
							"type": "IN",
							"provider": "-",
							"mem": 40,
							"pmal": 0.6,
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 2
						}
					}, {
						"id": "I6",
						"value": {
							"descr": "fornitore di macchine utensili",
							"type": "IN",
							"provider": "-",
							"mem": 45,
							"pmal": 0.6,
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 2
						}
					}, {
						"id": "C1",
						"value": {
							"descr": "primo offerente - 1",
							"type": "COMP",
							"provider": "-",
							"mem": 0,
							"pmal": 0.4,
							"func": "SUM",
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 0
						}
					}, {
						"id": "C2",
						"value": {
							"descr": "primo offerente - 2",
							"type": "COMP",
							"provider": "-",
							"mem": 0,
							"pmal": 0.4,
							"func": "SUM",
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 0
						}
					}, {
						"id": "C3",
						"value": {
							"descr": "secondo offerente - 1",
							"type": "COMP",
							"provider": "-",
							"mem": 0,
							"pmal": 0.3,
							"func": "SUM",
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 0
						}
					}, {
						"id": "C4",
						"value": {
							"descr": "secondo offerente - 2",
							"type": "COMP",
							"provider": "-",
							"mem": 0,
							"pmal": 0.3,
							"func": "SUM",
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 0
						}
					}, {
						"id": "C5",
						"value": {
							"descr": "primo offerente - 3",
							"type": "COMP",
							"provider": "provider sicuro",
							"mem": 0,
							"pmal": 0.1,
							"func": "SUM",
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 0
						}
					}, {
						"id": "C6",
						"value": {
							"descr": "secondo offerente - 3",
							"type": "COMP",
							"provider": "provider sicuro",
							"mem": 0,
							"pmal": 0.1,
							"func": "SUM",
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 0
						}
					}, {
						"id": "C7",
						"value": {
							"descr": "ente appaltante",
							"type": "COMP",
							"provider": "-",
							"mem": 0,
							"pmal": 0.1,
							"func": "MIN",
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 0
						}
					}, {
						"id": "R1",
						"value": {
							"descr": "agente",
							"type": "RES",
							"provider": "-",
							"mem": 0,
							"pmal": 0.1,
							"func": null,
							"calculatedRisk": "0.0",
							"highlight": false,
							"shares": 0
						}
					}],
					"edges": [{
						"id": "I1-C1-0-1",
						"value": {
							"label": "0",
							"from": "I1",
							"to": "C1",
							"type": "SS",
							"highlight": false,
							"shareNumber": 1
						}
					}, {
						"id": "I1-C2-0-2",
						"value": {
							"label": "0",
							"from": "I1",
							"to": "C2",
							"type": "SS",
							"highlight": false,
							"shareNumber": 2
						}
					}, {
						"id": "I2-C1-0-1",
						"value": {
							"label": "0",
							"from": "I2",
							"to": "C1",
							"type": "SS",
							"highlight": false,
							"shareNumber": 1
						}
					}, {
						"id": "I2-C2-0-2",
						"value": {
							"label": "0",
							"from": "I2",
							"to": "C2",
							"type": "SS",
							"highlight": false,
							"shareNumber": 2
						}
					}, {
						"id": "I3-C1-0-1",
						"value": {
							"label": "0",
							"from": "I3",
							"to": "C1",
							"type": "SS",
							"highlight": false,
							"shareNumber": 1
						}
					}, {
						"id": "I3-C2-0-2",
						"value": {
							"label": "0",
							"from": "I3",
							"to": "C2",
							"type": "SS",
							"highlight": false,
							"shareNumber": 2
						}
					}, {
						"id": "I4-C3-0-1",
						"value": {
							"label": "0",
							"from": "I4",
							"to": "C3",
							"type": "SS",
							"highlight": false,
							"shareNumber": 1
						}
					}, {
						"id": "I5-C3-0-1",
						"value": {
							"label": "0",
							"from": "I5",
							"to": "C3",
							"type": "SS",
							"highlight": false,
							"shareNumber": 1
						}
					}, {
						"id": "I6-C3-0-1",
						"value": {
							"label": "0",
							"from": "I6",
							"to": "C3",
							"type": "SS",
							"highlight": false,
							"shareNumber": 1
						}
					}, {
						"id": "I4-C4-0-1",
						"value": {
							"label": "0",
							"from": "I4",
							"to": "C4",
							"type": "SS",
							"highlight": false,
							"shareNumber": 1
						}
					}, {
						"id": "I5-C4-0-2",
						"value": {
							"label": "0",
							"from": "I5",
							"to": "C4",
							"type": "SS",
							"highlight": false,
							"shareNumber": 2
						}
					}, {
						"id": "I6-C4-0-2",
						"value": {
							"label": "0",
							"from": "I6",
							"to": "C4",
							"type": "SS",
							"highlight": false,
							"shareNumber": 2
						}
					}, {
						"id": "C1-C5-1-0",
						"value": {
							"label": "1",
							"from": "C1",
							"to": "C5",
							"type": "PT",
							"highlight": false,
							"shareNumber": 0
						}
					}, {
						"id": "C2-C5-1-0",
						"value": {
							"label": "1",
							"from": "C2",
							"to": "C5",
							"type": "PT",
							"highlight": false,
							"shareNumber": 0
						}
					}, {
						"id": "C3-C6-1-1",
						"value": {
							"label": "1",
							"from": "C3",
							"to": "C6",
							"type": "PT",
							"highlight": false,
							"shareNumber": 0
						}
					}, {
						"id": "C4-C6-1-0",
						"value": {
							"label": "1",
							"from": "C4",
							"to": "C6",
							"type": "PT",
							"highlight": false,
							"shareNumber": 0
						}
					}, {
						"id": "C5-C7-2-0",
						"value": {
							"label": "2",
							"from": "C5",
							"to": "C7",
							"type": "PT",
							"highlight": false,
							"shareNumber": 0
						}
					}, {
						"id": "C6-C7-2-0",
						"value": {
							"label": "2",
							"from": "C6",
							"to": "C7",
							"type": "PT",
							"highlight": false,
							"shareNumber": 0
						}
					}, {
						"id": "C7-R1-3-0",
						"value": {
							"label": "3",
							"from": "C7",
							"to": "R1",
							"type": "PT",
							"highlight": false,
							"shareNumber": 0
						}
					}]
				};

				var i = 0, j = 0, e = 0;
				var timeTimeoutString = 50,
					timeTimeoutValue = 30,
					timeTimeoutStringCom = 100,
					timeTimeoutValueCom = 1000;
				var timeoutNodes, timeoutEdges;

/*
				var typewriter = function(char) {
					$scope.nameNew += char;
					console.log(char);
					$scope.$apply();
					if(i == json.nodes[j].id.length-1) {
						clearTimeout(timeout);
						setTimeout()
					} else {
						setTimeout(typewriter, timeTimeoutString, json.nodes[j].id[++i]);
					}
				};

				setTimeout(typewriter,timeTimeoutString,json.nodes[j].id[i]);
 }
 */

				var typeWriterEdges = function(edge) {
					console.log(edge);
					if(e == json.edges.length - 1) {
						$timeout.cancel(timeoutEdges);
						$scope.showParameters(false);
						$scope.simulationRunning = true;
						new Practice();
						$scope.generateChart();
						$timeout(function(){
							Practice.runIntervalSimulation(2000).then(function(){
								$scope.simulationRunning = false;
							});
						},500);
						console.log("finito");
					}
					else {
						var timeoutFrom,
							timeoutTo,
							timeoutTime;
						var typeWriterFrom = function(char) {
							console.log(char);
							$scope.fromNew += char;
							if(i == edge.value.from.length - 1 ) {
								$timeout.cancel(timeoutFrom);
								i = 0;

								var typeWriterTo = function(char) {
									console.log(char);
									$scope.toNew += char;
									if(i == edge.value.to.length - 1) {
										$timeout.cancel(timeoutTo);
										i = 0;

										var typeWriterTime = function(actual, num) {
											console.log(actual);
											$scope.timeNew = actual;

											if(actual == num) {
												$timeout.cancel(typeWriterTime);
												i = 0;
												$scope.edgeTypeNew = edge.value.type;
												$scope.addCommunication();

												timeoutEdges = $timeout(function () {
													typeWriterEdges(json.edges[++e]);
												}, 800);

											} else {
												timeoutTime = $timeout(function(){
													typeWriterTime(++actual, parseInt(edge.value.label));
												},timeTimeoutValueCom);
											}
										};
										typeWriterTime(0, parseInt(edge.value.label));
									} else {
										timeoutTo = $timeout(function(){
											typeWriterTo(edge.value.to[++i]);
										},timeTimeoutStringCom);
									}
								};
								typeWriterTo(edge.value.to[i]);
							} else {
								timeoutFrom = $timeout(function(){
									typeWriterFrom(edge.value.from[++i]);
								},timeTimeoutStringCom);
							}
						}
						typeWriterFrom(edge.value.from[i]);
					}

				};

				var typewriterNodes = function(node) {
					console.log(node);
					if (j == json.nodes.length - 1) {
						$timeout.cancel(timeoutNodes);
						typeWriterEdges(json.edges[e]);
					}
					else {
						var timeoutName,
							timeoutDescr,
							timeoutMem,
							timeoutPMAL,
							timeoutProvider;

						console.log(node);
						var typeWriterNodeName = function (char) {
							console.log(char);
							$scope.nameNew += char;

							if (i == node.id.length - 1) {
								$timeout.cancel(timeoutName);
								i = 0;
								// invoco timeout per descrizione
								var typeWriterNodeDescr = function (char) {
									console.log(char);
									$scope.descrizioneNew += char;
									if (i == node.value.descr.length - 1) {
										$timeout.cancel(timeoutDescr);
										i = 0;

										var typeWriterMem = function (actual, num) {
											console.log(actual);
											$scope.memNew = actual;
											if (actual == num) {
												$timeout.cancel(timeoutMem);
												i = 0;

												var typeWriterPMAL = function (actual, num) {
													console.log(actual);
													$scope.maliciousProbabilityNew = actual;

													if (actual == Number(num.toFixed(1))) {
														$timeout.cancel(timeoutPMAL);
														i = 0;

														var typeWriterProvider = function (char) {
															console.log(char);
															$scope.providerNodeNew += char;
															if (i == node.value.provider.length - 1) {
																$timeout.cancel(timeoutProvider);
																i = 0;
																$scope.nodeTypeNew = node.value.type;
																$scope.nodeFunctionNew = node.value.func;

																$scope.addNode();

																timeoutNodes = $timeout(function () {
																	typewriterNodes(json.nodes[++j]);
																}, 100);
															}
															else {
																timeoutProvider = $timeout(function () {
																	typeWriterProvider(node.value.provider[++i]);
																}, timeTimeoutString);
															}
														}

														typeWriterProvider(node.value.provider[i]);
													}
													else {
														timeoutPMAL = $timeout(function () {
															actual = actual + 0.1;
															typeWriterPMAL(Number(actual.toFixed(1)), node.value.pmal);
														}, timeTimeoutValue);

													}
												};
												typeWriterPMAL(0, node.value.pmal);
											}
											else {
												timeoutMem = $timeout(function () {
													typeWriterMem(++actual, node.value.mem);
												}, timeTimeoutValue);
											}
										};

										typeWriterMem(0, node.value.mem);
									} else {
										timeoutDescr = $timeout(function () {
											typeWriterNodeDescr(node.value.descr[++i]);
										}, timeTimeoutString);
									}
								};

								typeWriterNodeDescr(node.value.descr[i]);
							} else {
								timeoutName = $timeout(function () {
									typeWriterNodeName(node.id[++i]);
								}, timeTimeoutString);
							}
						};
						typeWriterNodeName(node.id[i])
						// put when other timeout was finished
						//timeoutName = setTimeout(typeWriterNodeName, 5000, json.nodes[++j]);
					}
				};
				typewriterNodes(json.nodes[j]);
			}
		});
	};
});