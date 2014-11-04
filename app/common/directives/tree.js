angular.module('dev').directive('hdt', function(RecursionHelper){
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            items: '='
        },
        replace: false,
        templateUrl: 'app/common/directives/hdt.html',
        compile: RecursionHelper.compile
    }
});
angular.module('dev').directive('hdtItem', function(RecursionHelper){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            items: '='
        },
        replace: false,
        compile: RecursionHelper.compile,
        templateUrl: 'app/common/directives/hdt-item.html'
    }
});

// http://blog.stackfull.com/2014/02/trees-in-angularjs/
// http://sporto.github.io/blog/2013/06/24/nested-recursive-directives-in-angular/
// http://stackoverflow.com/questions/14430655/recursion-in-angular-directives
// http://stackoverflow.com/questions/19125551/angularjs-understanding-a-recursive-directive
angular.module("dev").directive("tree",
    function ($compile) {
        //Here is the Directive Definition Object being returned 
        //which is one of the two options for creating a custom directive
        //http://docs.angularjs.org/guide/directive
        return {
            restrict: "EA",
            //We are stating here the HTML in the element the directive is applied to is going to be given to
            //the template with a ng-transclude directive to be compiled when processing the directive
            transclude: true,
            scope: { family: '=' },
            template:
                '<ul>' +
                    '<li ng-transclude></li>' +
                    '<li ng-repeat="child in family.children">' +
                        '<tree family="child"><div ng-transclude></div></tree>' +
                    '</li>' +
                '</ul>',
                
                    //'<li>' +
                    //    '<div ng-transclude ></div>' +
                    //    '<ul>' +
                    //        '<tree ng-repeat="child in family.children" family="child">' +
                    //            '<ng-transclude />' +
                    //        '</tree>' +
                    //    '</ul>' +
                    //'</li>',
            compile: function (tElement, tAttr, transclude) {
                //We are removing the contents/innerHTML from the element we are going to be applying the 
                //directive to and saving it to adding it below to the $compile call as the template
                var contents = tElement.contents().remove();
                var compiledContents;
                return function (scope, iElement, iAttr) {

                    if (!compiledContents) {
                        //Get the link function with the contents frome top level template with 
                        //the transclude
                        compiledContents = $compile(contents, transclude);
                    }
                    //Call the link function to link the given scope and
                    //a Clone Attach Function, http://docs.angularjs.org/api/ng.$compile :
                    // "Calling the linking function returns the element of the template. 
                    //    It is either the original element passed in, 
                    //    or the clone of the element if the cloneAttachFn is provided."
                    compiledContents(scope, function (clone, scope) {
                        //Appending the cloned template to the instance element, "iElement", 
                        //on which the directive is to used.
                        iElement.append(clone);
                    });
                };
            }
        };
    });