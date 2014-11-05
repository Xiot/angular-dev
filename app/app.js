angular.module('dev', ['ui.router']);


angular.module('dev')
.config(function (validationServiceProvider) {

    var person = new ValidationObject();

    person.validations.firstName = {
        'ng-required': true,
        'ng-minlength': 5
    };
    person.validations.firstNameMatch = {
        'must-match': '.firstName',
        'ng-required': true,
        'ng-minlength': 5
    };

    //validator.add('firstName', 'ng-required', true);
    //validator.add('firstName', 'ng-minlength', 5);
    //validator.add('firstNameMatch', 'must-match', '.firstName');
    //validator.add('firstNameMatch', 'ng-required', true);

    validationServiceProvider.addValidator('person', person);

});