/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 29/10/14.
 */

angular.module("PracticeSimulator").controller("PracticeChartsController", function($scope, $modalInstance, $timeout, Practice, PracticeSETOperations){
	if(!Practice.isInitialized()) {
		new Practice();
	}
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
	/*
	 {
	 "name": "nodo1-nodo2-nodo3"
	 "risk": floatRisk
	 "numberOfNodes": 3
	 }
	 */

	 var nodesRanking = [];

	// build array for d3 scatter visualization
	for(var i = 0; i < powerSet.length-1; i++) { // -1 because I don't want to take empty object in power set
		var name = "";
		var risk = 1.0;
		for(var j = 0; j < powerSet[i].length; j++) {
			name = name + ((name != "") ? "-" : "") + powerSet[i][j].ID;
			risk = risk * powerSet[i][j].RISK;
		}
		nodesRanking.push({
			name: name,
			y: risk,
			x: powerSet[i].length
		});
	}

	// delay for animation in modal div
	$timeout(function() {
		var chart = new CanvasJS.Chart("practice-scatter-plot",
			{
				title:{
					text: "Cost Impact on Business for leaked information",
					fontFamily: "arial black",
					fontColor: "DarkSlateGrey",
					fontSize: 15
				},
				axisX: {
					title:"Number of node aggregates",
					titleFontFamily: "arial",
					titleFontSize: 12

				},
				axisY:{
					title: "Risk",
					titleFontFamily: "arial",
					titleFontSize: 12
				},

				data: [
					{
						type: "scatter",
						color: "#17cf00",
						toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <br/> <strong>Risk</strong> {y}<br/> <strong>Number of nodes aggregates</strong> {x} ",
						dataPoints: nodesRanking
					}
				],

				zoomEnabled: true
			});

		chart.render();
	},100);

	$scope.exit = function() {
		$modalInstance.dismiss('exit');
	}
});
