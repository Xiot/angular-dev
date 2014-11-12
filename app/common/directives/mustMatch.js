angular.module('dev')
 .directive('mustMatch', function () {
     
     function getFullTargetPath(propertyPath, modelPath) {
         if (propertyPath[0] !== '.')
             return propertyPath

         var propertyName = propertyPath.substring(1);
         
         var segments = modelPath.split('.');
         if (segments.length === 1)
             return propertyName;

         segments.splice(segments.length - 1, 1, propertyName);
         var fullPropertyPath = segments.join('.');
         return fullPropertyPath;
     }

     return {
         require: 'ngModel',
         link: function (scope, element, attrs, ngModel) {
             
             var fullPropertyPath = getFullTargetPath(attrs.mustMatch, attrs.ngModel);

             if (attrs.mustMatchWatch) {
                 scope.$watch(fullPropertyPath, function () {
                     ngModel.$validate();
                 });
             }

             ngModel.$validators.mustMatch = function (modelValue, viewValue) {
                 var targetValue = scope.$eval(fullPropertyPath);
                 return targetValue === modelValue;
             }
         }
     };
 });