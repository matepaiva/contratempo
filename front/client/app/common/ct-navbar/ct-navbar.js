import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ctNavbarComponent from './ct-navbar.component';

export default angular.module('navbar', [
    uiRouter
])
.component('ctNavbar', ctNavbarComponent)
.name;
