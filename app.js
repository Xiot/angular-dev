angular.module('ng-dev', ['ui.router']);

angular.module('ng-dev').controller('RootController', function($scope) {
    $scope.message = "Hello World";
});


angular.module('ng-dev').config(function($stateProvider){
	$stateProvider.state('root', {
		url: '',
		templateUrl: 'partials/root.html',
		controller: 'RootController'
	});
});