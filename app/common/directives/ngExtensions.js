
angular.module('ng-extensions', [])
.directive('notifyWhenRepeatFinished', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (scope.$last) {
                $timeout(function() {
                    scope.$emit('repeatFinished');
                });
            }
        }
    };
}])