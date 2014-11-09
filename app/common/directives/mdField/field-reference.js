angular.module('form.input', [])
    .directive('field', function ($compile, $http, $templateCache, $interpolate, fieldTemplate) {

        function loadTemplate(template) {

            return fieldTemplate.getTemplate(template);

            //var templatePath = 'template/field/' + template;

            //return $http.get(templatePath, { cache: $templateCache })
            //    .then(function(response) {
            //        return angular.element(response.data);
            //    }, function(response) {
            //        throw new Error("The template '" + template + "' was not found.");
            //    });
        }

        function findInputElement(templateElement) {
            return angular.element(templateElement.find('input')[0]
                || templateElement.find('select')[0]
                || templateElement.find('textarea')[0]);
        }

        function findLabelElement(templateElement) {
            return templateElement.find('label');
        }

        function getValidationMessageMap(originalElement) {
            var validationMessages = {};
            angular.forEach(originalElement.find('validator'), function(element) {
                element = angular.element(element);
                validationMessages[element.attr('key')] = $interpolate(element.text());
            });
            return validationMessages;
        }

        function getLabelContent(element) {
            var label = findLabelElement(element);
            return label[0] && label.html();
        }

        return {
            restrict: 'E',
            priority: 100,
            terminal: true,
            compile: function(element, attrs) {
                if (attrs.ngRepeat || attrs.ngSwitch || attrs.uiIf)
                    throw new Error('The ng-repeat, ng-switch and ui-if directives are not supported on the same element as the field directive.');

                if (!attrs.ngModel)
                    throw new Error('The ng-model directive must appear on the field element');

                var validationMessages = getValidationMessageMap(element);
                var labelContent = getLabelContent(element);
                element.html('');

                return function postLink(scope, element, attrs) {
                    // loadTemplate(attrs.template || 'input.html')
                    fieldTemplate.getTemplate(attrs.template).then(function(templateElement) {
                        var childScope = scope.$new();
                        childScope.$validationMessages = angular.copy(validationMessages);
                        childScope.$fieldId = attrs.name || attrs.ngModel.replace('.', '_').toLowerCase() + '_' + childScope.$id;
                        childScope.$fieldLabel = labelContent;

                        childScope.$watch('$field.$dirty && $field.$error', function(errorList) {
                            childScope.$fieldErrors = [];
                            angular.forEach(errorList, function(invalid, key) {
                                if (invalid)
                                    childScope.$fieldErrors.push(key);
                            });
                        }, true);


                        var options = scope.$eval(attrs.fieldOptions);
                        childScope.options = options;
                        childScope.propertyDefinition = scope.$eval(attrs.property);

                        var inputElement = findInputElement(templateElement);
                        angular.forEach(attrs.$attr, function(original, normalized) {
                            var value = element.attr(original);
                            inputElement.attr(original, value);
                        });

                        inputElement.attr('name', childScope.$fieldId);
                        inputElement.attr('id', childScope.$fieldId);
                        
                        var labelElement = findLabelElement(templateElement);                        
                        labelElement.attr('for', childScope.$fieldId);
                        labelElement.html(labelContent);

                        element.append(templateElement);
                        $compile(templateElement)(childScope);

                        childScope.$field = inputElement.controller('ngModel');
                    });


                };
            }
        };
    })
    .directive('camelCase', function($parse) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, controller) {

                var toCamelCase = function(source) {

                    if (source === null || source === undefined || source.length === 0)
                        return "";

                    var words = source.split(/[\s]/);
                    var cased = "";
                    for (var i = 0; i < words.length; i++) {

                        if (cased.length > 0)
                            cased += " ";
                        
                        if(words[i].length > 0)
                            cased += words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
                    }
                    return cased;
                };

                var camelCaseParser = function (source) {

                    if (!source)
                        return source;

                    var caretPosition = element[0].selectionStart;

                    var camelCased = toCamelCase(source);
                    if (camelCased !== source) {

                        console.log('CamelCase: ' + source + ' -> ' + camelCased);

                        controller.$setViewValue(camelCased);                        
                        controller.$render();
                        
                        setCaretPosition(element[0], caretPosition);
                    }
                    return camelCased;
                };

                var setCaretPosition = function(target, index) {
                    if (target == null)
                        return;

                    if (target.createTextRange) {
                        var range = target.createTextRange();
                        range.move('character', index);
                        range.select();
                    } else {
                        if (target.selectionStart) {
                            target.focus();
                            target.setSelectionRange(index, index);
                        } else {
                            target.focus();
                        }
                    }
                }


                controller.$parsers.push(camelCaseParser);
                
                var currentValue = $parse(attrs.ngModel)(scope);

                camelCaseParser(currentValue);
            }
        };
    })

    .directive('displayField', function(fieldTemplate) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    property: '=',
                    options: '=fieldOptions'
                },
                controller: function($scope) {
                    $scope.templateUrl = fieldTemplate.getDisplayTemplateUrl($scope.property.type);
                },
                template: '<div ng-include="templateUrl"></div>'
            }
        })
;