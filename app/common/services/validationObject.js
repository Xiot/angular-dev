angular.module('dev').provider('validationService', function () {

    var validators = {};

    //TODO: Enhance validations
    /*  validations can be expanded to the following:
            {
                name:           // local name
                directive:      // name of the directive to add to the element
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
    this.property = function(name, options){
        propertyValidators[name] = angular.extend({}, options, { name: name });
        return this;
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
    var normalizePropertyValidator = function(name, config){

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
            get: function (name, obj) {
                if (!validators[name]) {
                    var wrapper = new ValidationObject();
                    wrapper.setObject(obj);
                    return wrapper;
                }

                var blueprint = angular.copy(validators[name]);
                blueprint.setObject(obj);
                return blueprint;
                    
            }
        }

    }

});


function ValidationObject() {

    this.validations = {};
    
    this.original = null;
    this.model = null;

    this.setObject = function (obj) {
        this.original = angular.copy(obj);
        this.model = obj;

        var self = this;

        for (var propertyName in this.model) {
            createProperty(this, propertyName);
        }
    }

    this.$commit = function () {
        this.$dirty = false;

        this.original = angular.copy(this.model);
    }

    this.$rollback = function () {
        this.$dirty = false;
        this.model = angular.copy(this.original);
    }

    this.getPatch = function () {
        return CreateJsonPatch(this.original, this.model);
    }

    this.getValidationsFor = function (name) {
        return this.validations[name];
    }

    this.add = function (name, type, arg) {

        if (!this.validations[name])
            this.validations[name] = {};

        this.validations[name][type] = arg || "";

    }
    this.$dirty = false;
    var self = this;

    function createProperty(obj, name) {
        Object.defineProperty(obj, name, {
            get: function () {
                return obj.model[name];
            },
            set: function (value) {
                obj.model[name] = value;
                obj.$dirty = true;
            },
            enumerable: true,
            
        });
    }

}