angular.module('dev').controller('RootController',
    function ($scope) {
        $scope.message = "Hello World";


        $scope.list = [
            {
                name: "Chris",
                items: [
                    {
                        name: "Joe",
                    },
                    {
                        name: "Bob",
                        items: [{ name: "Bill" }]

                    }
                ]
            },
            {
                name: "Sarah",
                items: [{name: "Jill"}]

            }
        ]
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
