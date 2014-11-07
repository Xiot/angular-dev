angular.module('dev')
.directive('validationError', function ($translate, $rootScope) {

    function updateErrors(scope, modelErrors) {
        //scope.er = modelErrors;
        scope.em = {};

        if (!modelErrors)
            return;

        var validating = scope.$model.$validatingModel;

        for (var p in modelErrors) {
            var map = validating.$validators[p];

            $translate(map.messageKey, { param: map.param }).then(function (x) {
                scope.em[p] = x;
            });
        }
    }

    return {
        restrict: 'E',
        require: ['^form'],
        scope: true,
        templateUrl: 'app/common/directives/validations/validationError.html',
        link: function (scope, element, attrs, controllers) {
            
            var form = controllers[0];
            scope.$model = form[attrs.name];

            var unbindTranslate = $rootScope.$on('$translateChangeSuccess', function () {
                updateErrors(scope, scope.$model.$error);
            });

            $rootScope.$on('$destroy', function () {
                unbindTranslate();
            })

            scope.$watchCollection("$model.$error", function (e) {
                updateErrors(scope, e);
            });

        }
    }
});