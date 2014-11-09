angular.module('dev', ['ui.router', 'pascalprecht.translate']);


angular.module('dev')
.config(function (validationServiceProvider, modelDefinitionServiceProvider) {

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
        });

    modelDefinitionServiceProvider
        .addFieldType('string', {
            element: "<input type='text'></input>"
        })
        .addFieldType('email', {
            element: "<input type='email'></input>"
        })
        .addFieldType('int', {
            element: "<input type='number' ng-trim='false'></input>",            
            validations: {
                pattern: {
                    param: "/^-?[0-9]+$/",
                    messageKey: "ERRORS.INTEGER"
                    },
                number: true
            }
        });


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

    modelDefinitionServiceProvider.add(personDefinition);
});

angular.module('dev').config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/lang/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en').fallbackLanguage('en');
})