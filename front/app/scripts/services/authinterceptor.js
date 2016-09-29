'use strict';

/**
 * @ngdoc service
 * @name contratempoApp.authInterceptor
 * @description
 * # authInterceptor
 * Factory in the contratempoApp.
 */
angular.module('contratempoApp')
    .factory('authInterceptor', function($localStorage, $location, $rootScope) {
        function request(config) {
            $rootScope.isSpinner = true;
            config.headers['x-access-token'] = $localStorage.jwtToken;
            return config;
        }

        function requestError(rejection) {
            $rootScope.isSpinner = true;
            console.log('requestError', rejection);
            return rejection;
        }

        function response(res) {
            $rootScope.isSpinner = false;
            console.log('response', res.status);
            return res;
        }

        function responseError(rejection) {
            console.log(rejection);
            $rootScope.isSpinner = false;
            throw new Error([rejection.status, rejection.data.errmsg]);
            // switch (rejection.status) {
            //     case 403:
            //         if (rejection.data.message === 'Token failed. Email or password incorrect.') {
            //             throw new Error(rejection.status);
            //         } else {
            //             $location.path('/login');
            //         }
            //         break;
            //     case 0:
            //         break;
            //     default:
            // }
            // console.log('responseError', rejection);
        }

        return {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };
    });
