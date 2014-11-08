angular.module('dev').provider('validationService', function () {

    var validators = {};

    //TODO: Enhance validations
    /*  validations can be expanded to the following:
            {
                name:           // local name
                directive:      // name of the directive to add to the element
                type:           // if the underlying element is an input, then type will get put in as the type
                param:          // parameter to directive.
                                // this can also be used in the error message
                messageKey:     // key to use to lookup in the $translate
                message:        // hardcoded value to use in case where $translate does not have
                                // a value or if messageKey is falsy
            }
        The defaults for the supported validations should all have defaults which can be registered.
        once a validation is registered it can be refered to by simply its name
        
    */

    var propertyValidators = {};
    this.validator = function (name, options) {

        var validation = normalizeValidator(name, options);

        propertyValidators[name] = validation;
        return this;
    }

    function normalizeValidator(name, options) {

        options = options || {};

        if (!options.type)
            options.type = "text";

        if (!options.messageKey && !options.message)
            options.messageKey = "ERRORS." + name;

        if (!options.directive)
            options.directive = "ng-" + name;

        options.name = name;
        return options;
    }

    this.addValidator = function (name, validator) {


        for (var propertyName in validator.validations) {


            var appliedObject = validator.validations[propertyName];

            var appliedKeys = Object.keys(appliedObject);

            for (var i = 0; i < appliedKeys.length; i++) {
                var valName = appliedKeys[i];

                var value = appliedObject[valName];
                appliedObject[valName] = normalizePropertyValidator(valName, value);
            }
            validator.validations[propertyName] = appliedObject;
        }

        validators[name] = validator;
    }
    //TODO: move the normalization to the same class that registers the validations
    // normalization should also happen as it comes in.
    var normalizePropertyValidator = function (name, config) {

        var current = propertyValidators[name];

        if (!angular.isObject(config))
            config = { param: config };

        var normalized = angular.extend({}, propertyValidators[name], config);

        if (!normalized.messageKey && !normalized.message)
            normalized.messageKey = "ERRORS." + name;

        if (!normalized.directive)
            normalized.directive = 'ng-' + name;

        return normalized;
    }


    this.$get = function () {

        return {
            get: function (name) {
                return propertyValidators[name];
            }
        }

    }

});