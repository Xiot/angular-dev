angular.module('dev', ['ui.router', 'pascalprecht.translate']);


angular.module('dev')
.config(function (validationServiceProvider) {


    validationServiceProvider
        .property('required', {
            directive: 'ng-required',
            param: true,
            messageKey: 'ERRORS.required',
            message: 'Required!',
        })
    .property('minlength', {})
    .property('maxlength', {})
    .property('pattern', {})
    .property('mustMatch', {
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

    //validator.add('firstName', 'ng-required', true);
    //validator.add('firstName', 'ng-minlength', 5);
    //validator.add('firstNameMatch', 'must-match', '.firstName');
    //validator.add('firstNameMatch', 'ng-required', true);

    validationServiceProvider.addValidator('person', person);

});

angular.module('dev').config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/lang/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
})