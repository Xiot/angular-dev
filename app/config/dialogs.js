angular.module('dev').config(function (dialogServiceProvider) {

    dialogServiceProvider
        .add('simple', {
            template: "<div><h2>{{data.title}}</h2><p>{{data.body}}</p><button ng-click='$dismiss()'>OK</button></div>",
            controller: function ($scope, data) {
                $scope.data = data;
            }
        });

});