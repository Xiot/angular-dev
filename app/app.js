angular.module('dev', ['ui.router', 'pascalprecht.translate']);


angular.module('dev')
.config(function (validationServiceProvider) {
    
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
        });

    var person = new ValidationObject();

    person.validations.firstName = {
        'required': true,
        'minlength': 5
    };
    person.validations.firstNameMatch = {
        'mustMatch': '.firstName',
        'required': true,
        'minlength': 5
    };

    validationServiceProvider.addValidator('person', person);

});

angular.module('dev').config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/lang/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
})