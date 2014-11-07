angular.module('dev').controller('ValidatingModelController', function ($scope) {

    

});

angular.module('dev').directive('validatingModel', function ($compile, $translate) {

    function setValidations(element, validations) {
        angular.forEach(validations, function (value, key) {

            var directiveName = value.directive;
            var params = value.param;

            element.attr(directiveName, params);
        });
    }
    
    function parsePath(scope, path) {
        var split = path.split('.');
        var propertyName = split[split.length - 1];
        split.splice(split.length - 1, 1);
        var vm = split.join('.');

        var model = scope.$eval(vm);

        var validators = model.getValidationsFor(propertyName);
        //return validators;

        return {
            model: model,
            name: propertyName,
            validators: validators
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

                    var validators = data.validators;
                    setValidations(iElement, validators);

                    controller.modelPath = modelPath;
                    controller.$validators = validators;
                    
                    if (form) {
                        
                        var unbind = scope.$watch(function () {
                            return form[attrs.name];
                        }, function (ngModel) {
                            ngModel.$validatingModel = controller;
                            unbind();
                        });
                    }
                    
                    var compiled = $compile(iElement)(scope);
                }
            }
        }
    }
})