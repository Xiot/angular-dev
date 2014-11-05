angular.module('dev').directive('camelCase', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, controller) {

            var toCamelCase = function(source) {

                if (source === null || source === undefined || source.length === 0)
                    return "";

                var words = source.split(/[\s]/);
                var cased = "";
                for (var i = 0; i < words.length; i++) {

                    if (cased.length > 0)
                        cased += " ";
                        
                    if(words[i].length > 0)
                        cased += words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
                }
                return cased;
            };

            var camelCaseParser = function (source) {

                if (!source)
                    return source;

                var caretPosition = element[0].selectionStart;

                var camelCased = toCamelCase(source);
                if (camelCased !== source) {

                    console.log('CamelCase: ' + source + ' -> ' + camelCased);

                    controller.$setViewValue(camelCased);                        
                    controller.$render();
                        
                    setCaretPosition(element[0], caretPosition);
                }
                return camelCased;
            };

            var setCaretPosition = function(target, index) {
                if (target == null)
                    return;

                if (target.createTextRange) {
                    var range = target.createTextRange();
                    range.move('character', index);
                    range.select();
                } else {
                    if (target.selectionStart) {
                        target.focus();
                        target.setSelectionRange(index, index);
                    } else {
                        target.focus();
                    }
                }
            }


            controller.$parsers.push(camelCaseParser);
                
            var currentValue = $parse(attrs.ngModel)(scope);

            camelCaseParser(currentValue);
        }
    };
})