/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 29/10/14.
 */

angular.module("PracticeSimulator").controller("PracticeChartsController", function($scope, $modalInstance, $timeout, Practice, PracticeSETOperations){
	Practice();
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
	console.log(nodesRanking);

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

/*	$timeout(function(){
		var chart = new Highcharts.Chart({
			chart: {
				renderTo: 'practice-scatter-plot',
				type: 'scatter',
				zoomType: 'xy'
			},

			xAxis: {
				title: {
					enabled: true,
					text: 'Number of alliances'
				}
			},

			yAxis: {
				title: {
					text: 'Risk'
				}
			},

			plotOptions: {
				series: {
					turboThreshold: 0
				}
			},

			series: [{
				data: nodesRanking
			}]

		});
	},500);*/


	/*

		// nodesRanking:
		*/
/*
	{
		"name": "nodo1-nodo2-nodo3"
		"risk": floatRisk
		"numberOfNodes": 3
	}
	*//*

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
			risk: risk,
			numberOfNodes: powerSet[i].length
		});
	}
	console.log(nodesRanking);
*/

/*
	for(var i = 0; i < powerSet.length; i++) {
		if(i % 4 == 0) {
			$scope.table.push([]);
		}
		$scope.table[$scope.table.length-1].push(powerSet[i]);
	}
	console.log($scope.table);
*/
	/*var chocolates = [{
		"name": "Dairy Milk",
		"manufacturer": "cadbury",
		"price": 45,
		"rating": 2
	}, {
		"name": "Galaxy",
		"manufacturer": "Nestle",
		"price": 42,
		"rating": 3
	}, {
		"name": "Lindt",
		"manufacturer": "Lindt",
		"price": 80,
		"rating": 4
	}, {
		"name": "Hershey",
		"manufacturer": "Hershey",
		"price": 40,
		"rating": 1
	}, {
		"name": "Dolfin",
		"manufacturer": "Lindt",
		"price": 90,
		"rating": 5
	}, {
		"name": "Bournville",
		"manufacturer": "cadbury",
		"price": 70,
		"rating": 2
	}];

// call the method below
	$timeout(function(){
		showScatterPlot(nodesRanking);
	},500);


	function showScatterPlot(data) {
		// just to have some space around items.
		var margins = {
			"left": 40,
			"right": 30,
			"top": 30,
			"bottom": 30
		};

		// this will be our colour scale. An Ordinal scale.
		var colors = d3.scale.category10();

		// we add the SVG component to the scatter-load div
		var container = d3.select("#practice-scatter-plot");

		var svg = container.append("svg")
						.append("g")
						.attr("transform", "translate(" + margins.left + "," + margins.top + ")");

		var height = parseInt(container.style('height').replace(/px/, ''));
		var width = parseInt(container.style('width').replace(/px/, ''));

*//*		var x = d3.scale.linear()
			.domain([0, width])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([0, height])
			.range([height, 0]);*//*

		// this sets the scale that we're using for the X axis.
		// the domain define the min and max variables to show. In this case, it's the min and max prices of items.
		// this is made a compact piece of code due to d3.extent which gives back the max and min of the price variable within the dataset
		var x = d3.scale.linear()
			.domain(d3.extent(data, function (d) {
				return d.numberOfNodes;
			}))
			// the range maps the domain to values from 0 to the width minus the left and right margins (used to space out the visualization)
			.range([0, width - margins.left - margins.right]);

		// this does the same as for the y axis but maps from the rating variable to the height to 0.
		var y = d3.scale.linear()
			.domain(d3.extent(data, function (d) {
				return d.risk;
			}))
			// Note that height goes first due to the weird SVG coordinate system
			.range([height - margins.top - margins.bottom, 0]);



		// we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
		svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
		svg.append("g").attr("class", "y axis");

		// this is our X axis label. Nothing too special to see here.
		svg.append("text")
			.attr("fill", "#414241")
			.attr("text-anchor", "end")
			.attr("x", width / 2)
			.attr("y", height - 35)
			.text("Price in pence (£)");


		// this is the actual definition of our x and y axes. The orientation refers to where the labels appear - for the x axis, below or above the line, and for the y axis, left or right of the line. Tick padding refers to how much space between the tick and the label. There are other parameters too - see https://github.com/mbostock/d3/wiki/SVG-Axes for more information
		var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
		var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

		// this is where we select the axis we created a few lines earlier. See how we select the axis item. in our svg we appended a g element with a x/y and axis class. To pull that back up, we do this svg select, then 'call' the appropriate axis object for rendering.
		svg.selectAll("g.y.axis").call(yAxis);
		svg.selectAll("g.x.axis").call(xAxis);

		// now, we can get down to the data part, and drawing stuff. We are telling D3 that all nodes (g elements with class node) will have data attached to them. The 'key' we use (to let D3 know the uniqueness of items) will be the name. Not usually a great key, but fine for this example.
		var chocolate = svg.selectAll("g.node").data(data, function (d) {
			return d.name;
		});
		svg.call(d3.behavior.zoom().x(x).y(y).scaleExtent([1,8]).on("zoom",function(){
			svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}));
		// we 'enter' the data, making the SVG group (to contain a circle and text) with a class node. This corresponds with what we told the data it should be above.

		var chocolateGroup = chocolate.enter().append("g").attr("class", "node")
			// this is how we set the position of the items. Translate is an incredibly useful function for rotating and positioning items
			.attr('transform', function (d) {
				return "translate(" + x(d.numberOfNodes) + "," + y(d.risk) + ")";
			});

		// we add our first graphics element! A circle!
		chocolateGroup.append("circle")
			.attr("r", 5)
			.attr("class", "dot")
			.style("fill", function (d) {
				// remember the ordinal scales? We use the colors scale to get a colour for our manufacturer. Now each node will be coloured
				// by who makes the chocolate.
				return colors(d.numberOfNodes);
			});

		// now we add some text, so we can see what each item is.
		chocolateGroup.append("text")
			.style("text-anchor", "middle")
			.attr("dy", -10)
			.text(function (d) {
				// this shouldn't be a surprising statement.
				return d.name;
			});
	}*/

	$scope.exit = function() {
		$modalInstance.dismiss('exit');
	}
});
