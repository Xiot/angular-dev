angular.module('dev').controller('RootController',
    function ($scope) {
        $scope.message = "Hello World";

        $scope.data = {
            name: "Chris",
            children: [
                {
                    name: "Joe",
                },
                {
                    name: "Bob",
                    children: [{ name: "Bill" }]

                }
            ]
        };

    });
