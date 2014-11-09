angular.module('dev').controller('MdFieldController', function ($scope) {

});

angular.module('dev').directive('mdField', function ($compile, modelDefinitionService) {

    function parseFieldName(binding) {
        var split = binding.split('.');
        var propertyName = split[split.length - 1];

        split.splice(split.length - 1, 1);

        return {
            model: split.join('.'),
            property: propertyName
        }
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


    var copyAttributes = function (target, prefix, attrs) {

        angular.forEach(attrs, function (value, key) {

            var split = parseSplit(key);

            if (split.prefix === prefix)
                target.attr(split.attribute, value);
        });
    }

    function setValidations(element, validations) {
        angular.forEach(validations, function (value, key) {

            var directiveName = value.directive;
            if (directiveName) {
                var params = value.param;
                element.attr(directiveName, params);
            }

            if (value.type) {
                element.attr('type', value.type);
            }

        });
    }

    // in order to make the ng-model on the inner input work, this can not create an isolated scope
    // this should then expose a controller on the scope to enable functionality downstream

    return {
        priority: 200,
        require: ['mdField', '^form'],
        controller: 'MdFieldController',
        templateUrl: 'app/common/directives/mdField/md-field.html',
        scope: true,
        link: function (scope, element, attrs, controllers) {

            var form = controllers[1];
            var mdField = controllers[0];

            var access = parseFieldName(attrs.field);
            var propertyName = access.property;

            var model = scope.$eval(access.model);
            if (!model)
                return;

            var modelType = model.definition.$name;
            if (!modelType)
                return;

            var modelDefinition = modelDefinitionService.get(modelType);
            if (!modelDefinition) return;

            var fieldDefinition = modelDefinition[propertyName];
            if (!fieldDefinition) return;

            var fieldType = modelDefinitionService.getFieldTypeDefinition(fieldDefinition.type);

            var inputTemplate = angular.element(fieldType.element);
            inputTemplate.attr('ng-model', attrs.field);
            inputTemplate.attr('name', propertyName);

            setValidations(inputTemplate, fieldDefinition.validations);
            copyAttributes(inputTemplate, 'input', attrs);

            // may not need to clone
            var contents = element.children().clone();

            var input = contents.find('input');
            input.replaceWith(inputTemplate);

            var validationElement = contents.find('validation-error');
            if (validationElement)
                validationElement.attr('name', propertyName);

            scope.$definition = modelDefinition[propertyName];

            element.html('');
            element.append(contents);
            var clone = $compile(contents)(scope);

            var ngModel = inputTemplate.controller('ngModel');

            scope.$model = ngModel;
            scope.$model.$definition = scope.$definition;

            scope.$watch(function () {
                return ngModel.$invalid && (ngModel.$dirty || ngModel.$touched || form.$submitted);

            }, function (value) {
                ngModel.$needsAttention = value;
            });


        }
    }
});