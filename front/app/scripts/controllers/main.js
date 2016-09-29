'use strict';

/**
 * @ngdoc function
 * @name contratempoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the contratempoApp
 */
angular.module('contratempoApp')
    .controller('MainCtrl', function(authService, userService) {
        var $this = this;

        $this.login = function() {
            authService.login($this.email, $this.password);
        };

        $this.getUsers = function() {
            userService.getUsers({ limit:500 })
                .success(function(data) {
                    $this.users = data;
                });
        };
        $this.register = function(){
            userService.newUser({
                name: $this.name,
                email: $this.email,
                password: $this.password,
                userSlug: $this.userSlug,
                description: $this.description
            })
            .success(function(success) {
                authService.saveToken(success.token);
            })
            .error(function(err) {
                console.log(err);
            });
        };

        $this.getUsers();
    });
