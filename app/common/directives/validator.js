angular.module('dev').directive('validator', function ($injector, $parse) {

    function parseValidators(text) {
        var re = new RegExp(/([$_a-z0-9]+)\((.+?)\)/i);
        var results = re.exec(text);
        if (!results)
            throw new Error('Invlaid validator expression \'' + text + '\'');

        var serviceName = results[1];
        var args = results[2].split(',');

        for (var i = 0; i < args.length; i++) {
            args[i] = args[i].trim();
        }

        return {
            service: serviceName,
            args: args
        };

    }

    function getValidations(attrs) {
        var keys = {};
        angular.forEach(attrs, function (desc, name) {
            if (!name.startsWith('validator'))
                return;

            if (!desc)
                return;

            var validation = parseValidators(desc);
            var key = name.substring(9) || validation.service;

            key = key[0].toLowerCase() + key.substring(1);

            keys[key] = validation;
        });
        return keys;
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

            ngModel.$errorParams = ngModel.$errorParams || {};

            var validations = getValidations(attrs);

            angular.forEach(validations, function (validator, key) {

                //var validator = parseValidators(desc);

                var service = $injector.get(validator.service);

                ngModel.$validators[key] = function (modelValue, viewValue) {
                    var arguments = angular.copy(validator.args);

                    for (var i = 0; i < arguments.length; i++) {
                        arguments[i] = scope.$eval(arguments[i]);
                    }

                    arguments.unshift(modelValue);

                    var retVal = service.apply(service, arguments);

                    if (!retVal) {
                        arguments.splice(0,1);
                        ngModel.$errorParams[key] = arguments;
                    } else {
                        delete ngModel.$errorParams[key];
                    }

                    return retVal;
                }
            });

        }
    }
});

angular.module('dev').factory('testVal', function () {

    return function (value, min, max) {
        return min < value && value < max;
    }

})