angular.module('dev').directive('scrollTarget', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$on('scrollTo', function (e, name) {

                var localName = attrs.scrollTarget || attrs.name;
                if (!localName)
                    return;

                if (localName === name)
                    element[0].focus();
            });
        }
    }
})