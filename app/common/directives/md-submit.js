angular.module('dev').directive('mdSubmit', function ($parse) {

    return {
        restrict: 'A',
        require: 'form',
        link: function (scope, element, attrs, form) {

            var unbind = element.bind('submit', function (e) {

                var firstInvalidName = '';

                angular.forEach(form, function (value, key) {
                    if (key.startsWith('$'))
                        return;

                    if (!value.$validate)
                        return;

                    value.$validate();

                    if (!firstInvalidName && value.$invalid)
                        firstInvalidName = value.$name;
                });

                if (!form.$valid) {

                    var firstInvalidElement = angular.element(element[0].querySelector(".ng-invalid"));

                    if (firstInvalidElement) {

                        firstInvalidName = firstInvalidElement.attr('scrollTarget')
                            || firstInvalidElement.attr('name')
                            || firstInvalidName;
                    }

                    scope.$broadcast('scrollTo', firstInvalidName);
                    return;
                }


                var fn = $parse(attrs.mdSubmit);
                if (fn)
                    fn(scope, { $event: e });

            });

            scope.$on('$destroy', function () {
                unbind();
            });
        }
    }
})