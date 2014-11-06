angular.module('dev')
.directive('validationError', function ($translate) {
    return {
        restrict: 'E',
        require: ['^form'],
        templateUrl: 'app/common/directives/validations/validationError.html',
        link: function (scope, element, attrs, controllers) {
            var form = controllers[0];
            var model = form[attrs.name];
            var validating = model.$validatingModel;

            scope.$model = model;

            scope.$watchCollection("$model.$error", function (e) {
                scope.er = e;
                scope.em = {};
                if (!e)
                    return;

                for (var p in e) {
                    //var keyName = "ERRORS." + p;

                    //var map = validating.$validators[p] || validating.$validators['ng-' + p];
                    var map = validating.$validators[p];

                    $translate(map.messageKey, { param: map.param }).then(function(x){
                        scope.em[p] = x;
                    });
                }

            });

        }
    }
});