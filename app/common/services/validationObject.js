



function ValidationObject(definition, model) {

    this.definition = definition;

    this.original = angular.copy(model);
    this.model = model;
    this.$dirty = false;
    var self = this;
    
    this.initialize = function (obj) {
        this.original = angular.copy(obj);
        this.model = obj;

        for (var propertyName in this.model) {
            createProperty(self, propertyName);
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

        var fieldDef = this.definition[name];
        return fieldDef && fieldDef.validations;        
    }

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

    self.initialize(model);

}