angular.module('dev')
.directive('validationError', function ($translate, $rootScope) {

    function updateErrors(scope, modelErrors) {
        
        scope.$errors = {};

        if (!modelErrors)
            return;

        var definition = scope.$field.$definition || (scope.$field.$validatingModel && scope.$field.$validatingModel.$definition);
        if (!definition)
            return;

        angular.forEach(modelErrors, function (value, key) {
            
            var map = definition.validations[key];

            // may want to try to use the default 'ERRORS.key' if the validation cant be found.
            // may want to put the parameters used in the error on the model
            //  something like $model.$errorArgs = {key: [3, 'b']}
            //  validator and md-field would have to do this
            // may want to devise a seperate directive to put these values on the $model

            var messageKey = map && map.messageKey || 'ERRORS.' + key;
            var params = (map && map.param) 
                || (scope.$field.$errorParams && scope.$field.$errorParams[key]);
            
            var message = $translate.instant(messageKey, { param: params });
            //var message =map 
            //    ? $translate.instant(map.messageKey, { param: map.param })
            //    : 'VALIDATION TYPE NOT DEFINED \'' + key + "'.";

            scope.$errors[key] = message;

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

                var errors = scope.$field && scope.$field.$error;
                updateErrors(scope, errors);
            });

            scope.$on('$destroy', function () {
                unbindTranslate();
            });

            scope.$watchCollection("$field.$error", function (e) {
                updateErrors(scope, e);
            });
            scope.$watch('$field.$definition', function (e) {

                var errors = scope.$field && scope.$field.$error;
                updateErrors(scope, errors);
            })

        }
    }
});