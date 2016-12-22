import angular from 'angular';
import ctNavbar from './ct-navbar/ct-navbar';
import Hero from './hero/hero';
import User from './user/user';

export default angular.module('app.common', [
    ctNavbar,
    Hero,
    User
])
.name;
