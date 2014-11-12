angular.module('dev').controller('MdFieldController', function ($scope) {

});

angular.module('dev').directive('mdField', function ($compile, modelDefinitionService, templateFactory,$injector) {

    function parseFieldName(binding) {
        var split = binding.split('.');
        var propertyName = split[split.length - 1];

        split.splice(split.length - 1, 1);

        return {
            model: split.join('.'),
            property: propertyName
        }
    }

    var parseSplit = function (key) {

        if (key.startsWith('input') || key.startsWith('label'))
            return {
                prefix: key.substring(0, 5),
                attribute: key.substring(5).snakeCase('-')
            };

        return {
            attribute: key
        };
    }

    var copyAttributesFrom = function (target, source) {

        if (!source)
            return;

        angular.forEach(source[0].attributes, function (attr) {
            if (target.attr(attr.name) === undefined)
                target.attr(attr.name, attr.value);
        });
    };

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

            if (value.type && !element.attr('type')) {
                element.attr('type', value.type);
            }

        });
    }

    function createInputElement(scope, fieldType, definition) {

        if (angular.isString(fieldType.element))
            return angular.element(fieldType.element);

        var element = $injector.invoke(
            fieldType.element,
            null,
            {
                $definition: definition,
                $scope: scope
            });
        return element;

    }

    // in order to make the ng-model on the inner input work, this can not create an isolated scope
    // this should then expose a controller on the scope to enable functionality downstream

    return {
        priority: 200,
        require: ['mdField', '^form'],
        controller: 'MdFieldController',
        //templateUrl: 'app/common/directives/mdField/md-field.html',
        scope: true,
        link: function (scope, element, attrs, controllers) {

            templateFactory.getTemplate(attrs.templateName).then(function (fieldTemplate) {

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

                var inputTemplate = createInputElement(scope, fieldType, fieldDefinition);
                
                // wrap the element in case there is more than 1 top level element returned
                // this is done so we can properly search for the input elements
                var wrap = angular.element('<div></div>');
                wrap.append(inputTemplate);

                var inputElements = wrap.find('input');

                inputElements.attr('ng-model', attrs.field);
                inputElements.attr('name', propertyName);

                setValidations(inputElements, fieldDefinition.validations);
                copyAttributes(inputElements, 'input', attrs);

                var input = fieldTemplate.find('input');
                copyAttributesFrom(inputElements, input);
                input.replaceWith(inputTemplate);

                var validationElement = fieldTemplate.find('validation-error');
                if (validationElement)
                    validationElement.attr('name', propertyName);

                scope.$definition = modelDefinition[propertyName];

                element.html('');
                element.append(fieldTemplate);
                var clone = $compile(fieldTemplate)(scope);

                var ngModel = inputElements.controller('ngModel');

                scope.$model = ngModel;
                scope.$model.$definition = scope.$definition;

                scope.$watch(function () {
                    return ngModel.$invalid && (ngModel.$dirty || ngModel.$touched || form.$submitted);

                }, function (value) {
                    ngModel.$needsAttention = value;
                });
            })
        }
    }
});