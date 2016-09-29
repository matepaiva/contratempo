'use strict';

/**
 * @ngdoc function
 * @name contratempoApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the contratempoApp
 */
angular.module('contratempoApp')
    .controller('HeaderCtrl', function(
        $rootScope,
        authService,
        userService
    ) {
        this.isOpenMenu = !$rootScope.user;
        this.sign = "in";



        var $this = this;
        this.updateUserSlug = function(name){
            console.log(name);
            if ($this.signUpForm.userSlug.$dirty) {
                $this.userSlug = $this.userSlug.replace(/[^\w]/gi, '').toLowerCase();;
            } else {
                if(name) {
                    $this.userSlug = name.replace(/[^\w]/gi, '').toLowerCase();
                } else{
                    $this.userSlug = name;
                }
            }
            if ($this.userSlug) {
                $this.userSlug = "@" + $this.userSlug.substring(0,12);
            }
        };

        this.showSign = function(query) {
            $this.sign = query;
        };

        this.signIn = function(form) {
            form.$submitted = true;
            if (form.$valid) {
                form.isSubmitDisabled = true;
                authService.signin(form.email.$modelValue, form.password.$modelValue)
                    .success(function(success) {
                        console.log(success);
                        $this.isOpenMenu = false;
                    })
                    .catch(function(err) {
                        if (/403/.test(err.message)) {
                            form.password.$error.wrongPassword = true;
                        } else {
                            window.alert("erro não tratado.");
                        }
                    })
                    .finally(function() {
                        form.isSubmitDisabled = false;
                    });
            }
        };
        this.signUp = function(form) {
            form.$submitted = true;
            if (form.$valid) {
                form.isSubmitDisabled = true;
                userService.signUp({
                        name: form.name.$modelValue,
                        userSlug: form.userSlug.$modelValue.substr(1),
                        email: form.email.$modelValue,
                        password: form.password.$modelValue,
                        description: form.description.$modelValue
                    })
                    .success(function(success) {
                        console.log(success);
                    })
                    .catch(function(err) {
                        for (var i = 0, fields = ['email', 'userSlug']; i < fields.length; i++) {
                            var regex = new RegExp(fields[i]);
                            if (regex.test(err.message)) {
                                form[fields[i]].$error.alreadyExists = true;
                            }
                        }
                    })
                    .finally(function() {
                        form.isSubmitDisabled = false;
                    });
            }
        };

    });
