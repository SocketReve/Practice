/**
 * Created by Luca Reverberi - socketreve (thereve@gmail.com) on 29/10/14.
 */

angular.module("PracticeSimulator").service("PracticeSETOperations", function($q, $interval, Graph2) {
	var PracticeSETOperations = {};
	PracticeSETOperations.PowerSet = function(o,w,e,r,s,E,t){for(r=[s=1<<(E=o.length)];s;)for(w=s.toString(2),e=t=w.length,r[--s]=[];e;)~-w[--e]||r[s].push(o[e+E-t]);return r};
	return PracticeSETOperations;
});