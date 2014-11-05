angular.module('dev').provider('validationService', function () {

    var validators = {};

    this.addValidator = function (name, validator) {
        validators[name] = validator;
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