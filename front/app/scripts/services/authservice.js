'use strict';

/**
 * @ngdoc service
 * @name contratempoApp.authService
 * @description
 * # authService
 * Service in the contratempoApp.
 */
angular.module('contratempoApp')
    .service('authService', function(
        $http,
        $rootScope,
        $localStorage,
        REST_API,
        jwtHelper
    ) {
        var $this = this;
        var endpoint = REST_API + '/token';

        $this.signin = function(email, password) {
            return $this.receiveToken(email, password)
                .success(function(success) {
                    return $this.saveToken(success.token);
                });
        };

        $this.signout = function() {
            $this.deleteToken();
            return delete $rootScope.user;
        };


        $this.getToken = function() {
            return $localStorage.jwtToken;
        };
        $this.receiveToken = function(email, password) {
            return $http.post(endpoint, {
                email: email,
                password: password
            });
        };
        $this.saveToken = function(token) {
            $localStorage.jwtToken = token;
            return $this.showLoggedUser(token);
        };
        $this.refreshToken = function() {
            return $http.put(endpoint);
        };
        $this.deleteToken = function() {
            return delete $localStorage.jwtToken;
        };
        $this.deleteAllTokens = function() {
            return $http.delete(endpoint + 's');
        };
        $this.showLoggedUser = function(token) {
            $rootScope.user = jwtHelper.decodeToken(token);
            $rootScope.user.firstName = $rootScope.user.name.split(' ')[0];
            return $rootScope.user;
        };
    });
