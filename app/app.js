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
        });
    
    //var person = new ValidationObject();

    //person.validations.firstName = {
    //    'required': true,
    //    'minlength': 5
    //};
    //person.validations.firstNameMatch = {
    //    'mustMatch': '.firstName',
    //    'required': true,
    //    'minlength': 5
    //};
    //person.validations.email = {
    //    required: true,
    //    email: true
    //};
    
    //validationServiceProvider.addValidator('person', person);


    var personDefinition = new ModelDefinition('person');
    personDefinition.firstName = {
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
        validations: {
            required: true,
            email: true
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