/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 27/10/14.
 */

angular.module("PracticeSimulator").service("PracticeCOMPFunctions", function() {
	var PracticeCOMPFunctions = {};

	PracticeCOMPFunctions.SUM = function(array) {
		var somma = 0;
		for(var i = 0; i < array.length; i++) {
			somma = somma + array[i];
		}
		return somma;
	};

	PracticeCOMPFunctions.MIN = function(array) {
		var minore = array[0];
		for(var i = 0; i < array.length; i++) {
			if(array[i] < minore) {
				minore = array[i];
			}
		}
		return minore;
	};

	PracticeCOMPFunctions.MAX = function(array) {
		var maggiore = array[0];
		for(var i = 0; i < array.length; i++) {
			if(array[i] > maggiore) {
				maggiore = array[i];
			}
		}
		return maggiore;
	};

	return PracticeCOMPFunctions;
});