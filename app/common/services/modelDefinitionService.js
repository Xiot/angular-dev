
function ModelDefinition(name) {
    
    this.$name = name;

}

angular.module('dev').provider('modelDefinitionService', function() {

    var definitions = {};
    var fieldTypes = {};

    this.add = function(definition) {
        definitions[definition.$name] = definition;
    }

    this.addFieldType = function (name, fieldTypeDefinition) {
        fieldTypes[name] = fieldTypeDefinition;
        return this;
    }

    this.$get = function(validationService) {

        function initialize() {

            angular.forEach(definitions, function (def, defName) {

                angular.forEach(def, function (field, fieldName) {

                    field.$modelType = defName;

                    if (!field.labelKey)
                        field.labelKey = "FIELD." + fieldName;

                    if (!field.type)
                        field.type = 'string';
                    
                    angular.forEach(field.validations, function(value, validationType) {

                        if (!angular.isObject(value))
                            value = { param: value };

                        var validationDefinition = validationService.get(validationType);
                        value = angular.extend({}, validationDefinition, value);

                        field.validations[validationType] = value;
                    });
                });
            });
        }

        initialize(validationService);

        return {
            create: function(modelType, model) {

                var definition = definitions[modelType];

                var wrapper = new ValidationObject(definition, model);
                return wrapper;
            },
            get: function(modelType){
                return definitions[modelType];
            },
            getFieldTypeDefinition: function (name) {
                return fieldTypes[name] || {element: "<input class='form-control'><input>"};
            }
        }

    };    
})