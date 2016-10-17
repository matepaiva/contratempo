'use strict';

/**
 * @ngdoc function
 * @name contratempoApp.controller:EdituserCtrl
 * @description
 * # EdituserCtrl
 * Controller of the contratempoApp
 */
angular.module('contratempoApp')
    .controller('EditUserCtrl', function(userService, $rootScope, $scope) {
        this.myImage = '';
        this.myCroppedImage = '';

        // var handleFileSelect = function(evt) {
        //     var file = evt.currentTarget.files[0];
        //     var reader = new FileReader();
        //     reader.onload = function(evt) {
        //         $scope.$apply(function($this) {
        //             $this.myImage = evt.target.result;
        //         });
        //     };
        //     reader.readAsDataURL(file);
        // };

        let handleFileSelect = (evt) => {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = evt => $scope.$apply(() => this.myImage = evt.target.result);
            reader.readAsDataURL(file);
        };


        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

        // this.myImage='';
        // this.myCroppedImage='';
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        userService.getUser($rootScope.user.userSlug)
            .then(response => this.editedUser = response.data);

        // let handleFileSelect = (evt) => {
        //     var file=evt.currentTarget.files[0];
        //     var reader = new FileReader();
        //     reader.onload = evt => this.myImage = evt.target.result;
        //     reader.readAsDataURL(file);
        // };
        // angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    });
