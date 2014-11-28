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
	"pmal": floatProbabilityMalicious
	"numberOfNodes": 3
	}
	*/

	 var nodesRanking = [];

	// build array for d3 scatter visualization
	for(var i = 0; i < powerSet.length-1; i++) { // -1 because I don't want to take empty object in power set
		var name = "";
		var prob = 1.0;
		for(var j = 0; j < powerSet[i].length; j++) {
			name = name + ((name != "") ? "-" : "") + powerSet[i][j].ID;
			prob = prob * powerSet[i][j].PMAL;
		}
		nodesRanking.push({
			name: name,
			y: prob,
			x: powerSet[i].length
		});
	}

	// delay for animation in modal div
	$timeout(function() {
		var chart = new CanvasJS.Chart("practice-scatter-plot",
			{
				title:{
					text: "Probability of Collusion",
					fontFamily: "arial black",
					fontColor: "DarkSlateGrey",
					fontSize: 15
				},
				axisX: {
					title:"Number of actors in coalition",
					titleFontFamily: "arial",
					titleFontSize: 12,
					interval: 1
				},
				axisY:{
					title: "Probability",
					titleFontFamily: "arial",
					titleFontSize: 12
				},

				data: [
					{
						type: "scatter",
						color: "#17cf00",
						toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <br/> <strong>Probability</strong> {y}<br/> <strong>Number of actors aggregates</strong> {x} ",
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
