angular.module('dev')
.directive('validationError', function ($translate, $rootScope) {

    function updateErrors(scope, modelErrors) {
        
        scope.$errors = {};

        if (!modelErrors)
            return;

        var validating = scope.$field.$validatingModel;

        angular.forEach(modelErrors, function (value, key) {

            var map = validating.$definition.validations[key];

            var message = $translate.instant(map.messageKey, { param: map.param });
            scope.$errors[map.name] = message;

            // Validator messages should be sorted by priority, and the highest priority should be set as $$first
            if (!scope.$errors.$$first)
                scope.$errors.$$first = message;
        });
    }

    return {
        restrict: 'E',
        require: '?^form',        
        scope: {
            $field:'=?field'
        },
        templateUrl: 'app/common/directives/validations/validationError.html',
        link: function (scope, element, attrs, form) {
            
            // Grab the ngModel directly from the $field attribute, or use the form and `name` property
            if (!scope.$field && form && attrs.name)
                scope.$field = form[attrs.name];

            var unbindTranslate = $rootScope.$on('$translateChangeSuccess', function () {
                updateErrors(scope, scope.$field.$error);
            });

            scope.$on('$destroy', function () {
                unbindTranslate();
            });

            scope.$watchCollection("$field.$error", function (e) {
                updateErrors(scope, e);
            });

        }
    }
});