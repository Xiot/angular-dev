angular.module('dev').directive('greaterThan', function () {

    function getFullTargetPath(propertyPath, modelPath) {
        if (propertyPath[0] !== '.')
            return propertyPath

        var propertyName = propertyPath.substring(1);

        var segments = modelPath.split('.');
        if (segments.length === 1)
            return propertyName;

        segments.splice(segments.length - 1, 1, propertyName);
        var fullPropertyPath = segments.join('.');
        return fullPropertyPath;
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

            var propertyPath = getFullTargetPath(attrs.greaterThan, attrs.ngModel);

            scope.$watch(propertyPath, function () {
                ngModel.$validate();
            });

            ngModel.$validators.greaterThan = function (modelValue, viewValue) {

                if (!modelValue)
                    return true;

                var targetValue = scope.$eval(propertyPath); //getTargetValue(attrs.greaterThan);
                return modelValue > targetValue;
            }

        }
    }
})