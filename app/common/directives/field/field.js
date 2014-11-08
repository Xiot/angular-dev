angular.module('dev')
.directive('validatingField', function ($compile, $http, $templateCache, $interpolate) {

    function parseFieldName(binding) {
        var split = binding.split('.');
        var propertyName = split[split.length - 1];
        return propertyName;
    }

    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snakeCase(name, separator) {
        separator = separator || '_';
        return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }

    var parseSplit = function (key) {

        if (key.startsWith('input') || key.startsWith('label'))
            return {
                prefix: key.substring(0, 5),
                attribute: snakeCase(key.substring(5), '-')
            };

        return {
            attribute: key
        };
    }

    return {
        restrict: 'E',
        priority: 200,
        scope: true,
        templateUrl: 'app/common/directives/field/field.html',
        compile: function (element, attrs) {

            var fieldName = parseFieldName(attrs.fieldModel);

            var label = element.find('label');
            if (label) {
                label.attr('for', fieldName);

                if(attrs.fieldLabel)
                    label.html("{{" + attrs.fieldLabel + "}}");
            }

            var input = element.find('input');
            if (input) {
                input.attr('validating-model', attrs.fieldModel);
                input.attr('name', fieldName);
            }

            angular.forEach(attrs, function (value, key) {

                var split = parseSplit(key);

                if (split.prefix === 'input') {
                    input.attr(split.attribute, value);

                } else if (split.prefix === 'label') {
                    label.attr(split.attribute, value);
                }
            });

            var errorElement = element.find('validation-error');
            if(errorElement)
                errorElement.attr('name', fieldName);

            return function postLink(scope, linkElement, linkAttrs) {
                scope.$model = scope.form[fieldName];

                //if(scope.$model.$validatingModel[fieldName].messageKey)

            }
        },
    }
})