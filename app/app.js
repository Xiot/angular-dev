angular.module('dev', ['ui.router', 'pascalprecht.translate']);


angular.module('dev')
.config(function (validationServiceProvider, modelDefinitionServiceProvider, templateFactoryProvider) {

    templateFactoryProvider
        .template('default', {
            templateUrl: '/app/templates/default.html'
        })
        .template('other', 'app/templates/other.html');

    validationServiceProvider
        .validator('required', {
            directive: 'ng-required',
            messageKey: 'ERRORS.required',
            message: 'Required!',
        })
        .validator('minlength')
        .validator('maxlength')
        .validator('pattern')
        .validator('mustMatch', {
            directive: 'must-match',
            messageKey: 'ERRORS.mustMatch'
        })
        .validator('email', {
            type: 'email'
        })
        .validator('min', {
            directive: 'min',
            messageKey: 'ERRORS.min'
        })
        .validator('number', {
            type: 'number',
            messageKey: "ERRORS.NAN"
        })
    .validator('greaterThan', {
        directive: 'greater-than'
    });

    modelDefinitionServiceProvider
        .addFieldType('string', {
            element: "<input type='text'></input>"
        })
        .addFieldType('email', {
            element: "<input type='email'></input>"
        })
        .addFieldType('int', {
            element: "<input type='number'></input>",
            validations: {
                pattern: {
                    param: "/^-?[0-9]+$/",
                    messageKey: "ERRORS.INTEGER"
                },
                number: true
            }
        })
        .addFieldType('date', {
            element: "<input type='date'></input>"
        })
        .addFieldType('enum', {
            
            element: function ($scope, $definition, $http) {

                $scope.localStuff = $definition.options.allowableValues;
                //TODO: handle `allowableValueFactory`, `displayMember`, `valueMember`, and `trackBy`
                
                var el = angular.element("<select ng-options='value for value in $model.$definition.options.allowableValues'></select>");
                //var el = angular.element("<select ng-options='value for value in localStuff'></select>");
                return el;
            }
        })
        .addFieldType('boolean', {

            //element: "<input type='checkbox' class=''></input>"
            element: "<div>" +
                        "<label class='radio-inline'>" +
                            "<input type='radio' ng-value='true' class=''><span translate='BOOL.TRUE'></span>" +
                        "</label>" +                     
                        "<label class='radio-inline'>" +
                            "<input type='radio' ng-value='false' class=''><span translate='BOOL.FALSE'></span>" +
                        "</label>" +
                     "</div>"
        });

    //TODO: Need way to load up enum values at runtime.
    // may be able to devise a directive to do it, using values from the `options` property on the definition.
    // will want to add properties to determine the value, display, and tracking members

    // TODO: Enable the definition of types at run time.
    // this will allow for definitions that will be retrieved from the server

    // TODO: Add conditional validation

    var personDefinition = new ModelDefinition('person');
    personDefinition.firstName = {
        type: 'string',
        validations: {
            required: true,
            minlength: 5,
            maxlength: 10,
            pattern: {
                param: "/^[a-z]+$/i",
                messageKey: 'ERRORS.INVALID_NAME'
            }
        },
        labelKey: 'FIELD.FIRSTNAME'
    };

    personDefinition.email = {
        type: 'email',
        validations: {
            required: true,
            email: true
        }
    }

    personDefinition.age = {
        type: 'int',
        validations: {
            min: 0
        }
    }

    personDefinition.birthDate = {
        type: 'date',
        validations: {
            required: true
        }
    };

    personDefinition.hireDate = {
        type: 'date',
        validations: {
            greaterThan: '.birthDate'
        }
    };

    personDefinition.gender = {
        type: 'enum',
        options: {
            allowableValues: ["Male", "Female"]
            // allowableValueFactory: injectable-function() -> promise
            // displayMember
            // valueMember
            // trackBy
        }
    }

    personDefinition.employed = {
        type: 'boolean',
        validations: {
            required: true
        }
    };

    modelDefinitionServiceProvider.add(personDefinition);
});

angular.module('dev').config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/lang/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
    //$translateProvider.fallbackLanguage('en');
})