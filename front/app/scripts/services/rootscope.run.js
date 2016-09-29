'use strict';

/**
 * @ngdoc service
 * @name contratempoApp.rootscope.run
 * @description
 * # rootscope functions and variables
 * in the contratempoApp.
 */
angular.module('contratempoApp')
    .run(function($rootScope, $translate, jwtHelper, $localStorage, authService) {
        $rootScope.storage = $localStorage;

        if ($rootScope.storage.jwtToken) {
            authService.showLoggedUser($rootScope.storage.jwtToken);
        }

        $rootScope.changeLanguage = function(langKey) {
            $translate.use(langKey);
        };
        $rootScope.getCurrentLanguage = function(){
            return $translate.proposedLanguage() || $translate.use();
        };

        $rootScope.signout = function() {
            return authService.signout();
        };
    });
