angular.module('dev')
    .directive('focusMe', function ($timeout) {
        return {
            restrict: 'A',
            priority: 0,
            link: function (scope, element, attrs) {

                $timeout(function () {
                    element[0].focus();
                }, 300);

            }
        };
    });