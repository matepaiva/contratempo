'use strict';

/**
 * @ngdoc service
 * @name countersApp.userService
 * @description
 * # userService
 * Service in the countersApp.
 */
angular.module('contratempoApp')
    .service('userService', function($http, REST_API, authService) {
        var $this = this;
        var endpoint = REST_API + '/users';

        $this.getUsers = function(query) {
            query = (query === undefined) ? {} : query;
            var queryString = (typeof query === Object) ? '' : '?';
            for (var key in query) {
                queryString += key + '=' + query[key] + '&';
            }

            return $http.get(endpoint + queryString);
        };
        $this.signUp = function(newUserObj) {
            return $http.post(endpoint, {newUser: newUserObj})
            .success(function(success) {
                return authService.saveToken(success.token);
            });
        };
    });
