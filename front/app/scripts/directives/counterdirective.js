'use strict';

/**
 * @ngdoc directive
 * @name contratempoApp.directive:counterDirective
 * @description
 * # counterDirective
 */
angular.module('contratempoApp')
    .directive('counter', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                title: '@',
                start: '@'
            },
            templateUrl: 'views/directives/counterdirective.tpl.html',
            controller: function($scope) {
                // $scope.$on('timer-tick', function(event, args) {
                //     console.log(event, args);
                // });
            }
        };
    });
