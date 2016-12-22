import angular from 'angular';
import uiRouter from 'angular-ui-router';
import aboutComponent from './about.component';
import aboutHtml2 from './about2.html';

import testeModule from './teste/teste';

let aboutModule = angular.module('about', [
    testeModule
])

.config(($stateProvider) => {
    "ngInject";
    $stateProvider
        .state('about', {
            abstract: true,
            url: '/about',
            template: aboutHtml2
        })
        .state('about.index', {
            url: '',
            component: 'about'
        })
        .state('about.teste', {
            url: '/teste',
            component: 'teste'
        });
})

.component('about', aboutComponent)

.name;

export default aboutModule;
