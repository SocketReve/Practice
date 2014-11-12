/**
 * Created by socketreve on 10/11/14.
 */

angular.module("PracticeSimulator").filter('unsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});