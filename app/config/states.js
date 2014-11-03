
angular.module('dev').config(
    function ($stateProvider) {

        $stateProvider.state('root', {
            url: '',
            templateUrl: 'app/areas/layout/root.html',
            controller: 'RootController'
        });
    });