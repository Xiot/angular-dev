angular.module('dev')
 .directive('mustMatch', function () {
     
     return {
         require: 'ngModel',
         link: function (scope, element, attrs, controller) {

             var getTargetValue = function () {
                 var propertyPath = attrs.mustMatch;
                 if(propertyPath[0] !== '.')
                     return scope.$eval(propertyPath);

                 var propertyName = propertyPath.substring(1);

                 var modelPath = attrs.ngModel;
                 var segments = modelPath.split('.');
                 if (segments.length === 1)
                     return propertyName;

                 segments.splice(segments.length - 1, 1, propertyName);
                 var fullPropertyPath = segments.join('.');

                 return scope.$eval(fullPropertyPath);

             }
             
             controller.$validators.mustMatch = function (modelValue, viewValue) {
                 var targetValue = getTargetValue();
                 return targetValue === modelValue;
             }

             // 1.2 way
             
             //scope.$watch(function () {

             //    var targetValue = getTargetValue();
             //    var checkValue = controller.$modelValue;

             //    var isValid = targetValue === checkValue;

             //    return isValid;

             //}, function (currentValue) {
             //    controller.$setValidity('mustMatch', currentValue);
             //    //if (!currentValue)
             //    //    controller.$setModelValue(undefined);
             //});
             

         }
     };
 });