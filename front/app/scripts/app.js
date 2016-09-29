'use strict';

/**
 * @ngdoc overview
 * @name contratempoApp
 * @description
 * # contratempoApp
 *
 * Main module of the application.
 */
angular
    .module('contratempoApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'pascalprecht.translate',
        'ngStorage',
        'angular-jwt',
        'angularSpinner',
        'ngMask',
        'timer'
    ])
    .config(function($routeProvider, $translateProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .when('/404', {
                templateUrl: '404.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .otherwise({
                redirectTo: '/404'
            });

        $translateProvider
            .useStaticFilesLoader({
                prefix: '/i18n/',
                suffix: '.json'
            })
            .preferredLanguage('br')
            .useSanitizeValueStrategy('escape')
            .useLocalStorage();

        $httpProvider.interceptors.push('authInterceptor');
    });
