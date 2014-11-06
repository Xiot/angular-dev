angular.module('dev').controller('RootController',
    function ($scope, validationService, $translate) {
        $scope.message = "Hello World";

        $scope.model = validationService.get('person', { firstName: 'Chris', firstNameMatch: 'Chris' });

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
                items: [{ name: "Jill" }]

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

        $scope.setLanguage = function (code) {
            $translate.use(code);
        }
    });
