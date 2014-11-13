angular.module('dev').controller('RootController',
    function ($scope, modelDefinitionService, $translate, toastr) {
        $scope.message = "Hello World";


        var person = {
            firstName: 'Chr',
            firstNameMatch: 'Chris',
            email: "cthomas@microdea.com",
            age: 33,
            birthDate: new Date(1981, 4, 28),
            hireDate: null,
            gender: "Male",
            employed: null
        };

        $scope.model = modelDefinitionService.create('person', person);
        
        $scope.setLanguage = function (code) {
            $translate.use(code);
        };

        $scope.onSubmit = function (e) {
            alert('submit');
        };

        $scope.toast = function(msg){
            toastr.error(msg, 'Mmmm Toast!', {closeButton: true, positionClass: 'toast-top-full-width'});
        }

    });
