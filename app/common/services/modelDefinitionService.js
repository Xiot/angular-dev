
function ModelDefinition(name) {
    
    this.$name = name;

}

angular.module('dev').provider('modelDefinitionService', function() {

    var definitions = {};

    this.add = function(definition) {
        definitions[definition.$name] = definition;
    }


    this.$get = function(validationService) {

        function initialize() {

            angular.forEach(definitions, function (def, defName) {

                angular.forEach(def, function (field, fieldName) {

                    if (!field.labelKey)
                        field.labelKey = "FIELD." + fieldName;

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

                //var blueprint = angular.copy(validators[name]);
                //blueprint.setObject(obj);
                //return blueprint;
            }
        }

    };    
})