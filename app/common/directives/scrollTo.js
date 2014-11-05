
angular.module('dev')
.directive('scrollTo', function() {

    function scrollToName(name) {
        var target = $("*[name='" + name + "']");
        scrollTo(target);
    }
    function scrollToId(id) {
        var target = $("#" + id);
        scrollTo(target);
    }

    function scrollTo(target) {

        var scrollOffset = window.innerHeight / 3;

        if (!scrollOffset)
            scrollOffset = 300;

        var topValue = findOffsetTop(target) - scrollOffset;
        if (topValue < 0)
            topValue = 0;
        
        $('html, body')
        //$(document.documentElement)
            .animate({
            scrollTop: topValue
        }, 500,
            "swing",
            function () { target.focus(); }
        );
    }
    
    function findOffsetTop(element) {

        if (element.is(":visible"))
            return element.offset().top;

        var visibleParent = element.parent(":visible");

        if (visibleParent == null || visibleParent.length == 0)
            return 0;

        return visibleParent.offset().top;

    }

    return {
        link: function(scope, element, attrs) {

            element.click(function() {

                var targetSelector = attrs['scrollTo'];

                var targetElement = null;
                if (targetSelector === '_top')
                    targetElement = $(document.body);
                else {
                    targetElement = $(targetSelector);
                }
                scrollTo(targetElement);
            });
        }
    };
})