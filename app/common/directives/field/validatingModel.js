angular.module('dev')
.directive('validatingField', function ($compile, $http, $templateCache, $interpolate, modelDefinitionService) {

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

    var copyAttributes = function(target, prefix, attrs){

        angular.forEach(attrs, function (value, key) {

            var split = parseSplit(key);

            if (split.prefix === prefix)
                target.attr(split.attribute, value);
        });
    }

    var initializeLabel = function (label, name, attrs) {
        if (!label)
            return;

        label.attr('for', name);

        if (attrs.fieldLabel)
            label.html("{{" + attrs.fieldLabel + "}}");

        copyAttributes(label, 'label', attrs);
    }

    var initializeInput = function (input, name, attrs) {
        if (!input)
            return;

        input.attr('validating-model', attrs.fieldModel);
        input.attr('name', name);

        copyAttributes(input, 'input', attrs);
    }

    return {
        restrict: 'E',
        priority: 200,
        scope: true,
        require: '^form',
        templateUrl: 'app/common/directives/field/field.html',
        compile: function (element, attrs) {

            var fieldName = parseFieldName(attrs.fieldModel);

            var label = element.find('label');
            initializeLabel(label, fieldName, attrs);
            
            var input = element.find('input');
            initializeInput(input, fieldName, attrs);

            var errorElement = element.find('validation-error');
            if (errorElement)
                errorElement.attr('name', fieldName);

            return function postLink(scope, linkElement, linkAttrs, form) {
                scope.$model = form[fieldName];
                return;
                /*
                var vmodel = scope.$model.$validatingModel;
                if (!vmodel)
                    return;

                var definition = vmodel.$definition;
                if (definition.type) {
                    var fyd = modelDefinitionService.getFieldTypeDefinition(definition.type);
                    var elementTemplate = ftd.element;

                    var cloned = angular.element(elementTemplate);
                    initializeInput(cloned, fieldName, linkAttrs);
                    
                    cloned = $compile(cloned)(scope);

                    var inputToReplace = linkElement.find('input');
                    inputToReplace.replaceWith(cloned);

                }
                */
                //if(scope.$model.$validatingModel[fieldName].messageKey)

            }
        },
    }
})