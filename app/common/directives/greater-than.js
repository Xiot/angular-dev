angular.module('dev').directive('greaterThan', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

            var getTargetValue = function (propertyPath) {                
                if (propertyPath[0] !== '.')
                    return scope.$eval(propertyPath);

                var propertyName = propertyPath.substring(1);

                var modelPath = attrs.ngModel;
                var segments = modelPath.split('.');
                if (segments.length === 1)
                    return propertyName;

                segments.splice(segments.length - 1, 1, propertyName);
                var fullPropertyPath = segments.join('.');

                return scope.$eval(fullPropertyPath);

            }
            var propertyPath = attrs.mustMatch;
            ngModel.$validators.greaterThan = function (modelValue, viewValue) {

                if (!modelValue)
                    return true;

                var targetValue = getTargetValue(attrs.greaterThan);
                return modelValue > targetValue;
            }

        }
    }
})