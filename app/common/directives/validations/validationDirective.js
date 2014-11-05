angular.module('dev').directive('validatingModel', function ($compile) {

    function setValidations(element, validations) {
        angular.forEach(validations, function (value, key) {
            element.attr(key, value);
        });
    }
    function getValidations(scope, path) {

        var split = path.split('.');
        var propertyName = split[split.length - 1];
        split.splice(split.length - 1, 1);
        var vm = split.join('.');

        var model = scope.$eval(vm);

        var validators = model.getValidationsFor(propertyName);
        return validators;
    }

    return {
        restrict: 'A',
        priority: 100,

        compile: function (element, attrs) {
            
            var modelPath = attrs.validatingModel;
            element.attr('ng-model', attrs.validatingModel);
            element.removeAttr("validating-model");
                        
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) { },
                post: function postLink(scope, iElement, iAttrs, controller) {

                    var validators = getValidations(scope, modelPath);
                    setValidations(iElement, validators);

                    var compiled = $compile(iElement)(scope);
                }
            }
        }
    }
})