import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'angular-material/angular-material.min.css';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';

import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';

angular.module('app', [
        'ngMaterial',
        uiRouter,
        Common,
        Components
    ])
    .config(($locationProvider) => {
        "ngInject";
        // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
        // #how-to-configure-your-server-to-work-with-html5mode
        $locationProvider.html5Mode(true).hashPrefix('!');
    })
    .component('app', AppComponent)
;
