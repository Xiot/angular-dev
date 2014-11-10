angular.module('dev').directive('mdSubmit', function ($parse) {

    return {
        restrict: 'A',
        require: 'form',
        link: function (scope, element, attrs, form) {

            var unbind = element.bind('submit', function (e) {

                var firstInvalid = '';

                angular.forEach(form, function (value, key) {
                    if (key.startsWith('$'))
                        return;

                    if (!value.$validate)
                        return;

                    value.$validate();

                    if (!firstInvalid && value.$invalid)
                        firstInvalid = value.$name;
                });

                if (!form.$valid) {
                    scope.$broadcast('scrollTo', firstInvalid);
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