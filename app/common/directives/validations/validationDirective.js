angular.module('dev').controller('ValidatingModelController', function ($scope) {

    

});

angular.module('dev').directive('validatingModel', function ($compile, $translate) {

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
    
    function parsePath(scope, path) {
        var split = path.split('.');
        var propertyName = split[split.length - 1];
        split.splice(split.length - 1, 1);
        var vm = split.join('.');

        var model = scope.$eval(vm);

        var fieldDefinition = model.definition[propertyName];//getValidationsFor(propertyName);
        //return validators;

        return {
            model: model,
            name: propertyName,
            definition: fieldDefinition
        };
    }

    return {
        restrict: 'A',
        priority: 100,
        name: 'validatingModel',
        require: ['validatingModel', '^form'],
        controller: 'ValidatingModelController',
        compile: function (element, attrs) {
            
            var modelPath = attrs.validatingModel;
            element.attr('ng-model', attrs.validatingModel);
            element.removeAttr("validating-model");
                        
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) { },
                post: function postLink(scope, iElement, iAttrs, controllers) {

                    var controller = controllers[0];
                    var form = controllers.length > 1 && controllers[1];

                    var data = parsePath(scope, modelPath);
                    
                    var definition = data.definition;
                    setValidations(iElement, definition.validations);

                    controller.modelPath = modelPath;
                    controller.$definition = definition;
                    controller.messageKey = definition.labelKey;
                    
                    if (form) {
                        
                        var unbind = scope.$watch(function () {
                            return form[attrs.name];

                        }, function (ngModel) {
                            ngModel.$validatingModel = controller;
                            
                            scope.$watch(function () {
                                return ngModel.$invalid && (ngModel.$dirty || ngModel.$touched || form.$submitted);

                            }, function(value) {
                                ngModel.$needsAttention = value;
                            });
                            
                            unbind();
                        });
                    }
                    
                    var compiled = $compile(iElement)(scope);
                }
            }
        }
    }
})