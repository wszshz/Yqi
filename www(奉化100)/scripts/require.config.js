requirejs.config({

    baseUrl: '',
    waitSeconds: 15,
    paths: {
        //Library
        'cordova': 'scripts/libs/cordova',
        'jQuery': 'scripts/libs/jquery.min',
        'ionic': 'scripts/libs/ionic.bundle',
        'localStorage': 'scripts/libs/angular-local-storage.min',
        'ebuy.phoneGapPlugin': 'scripts/phonePlugin',
        //Controller
        'ebuy.controllers': 'scripts/controller',
        //module, config, router, directive, service
        'app': 'scripts/app',
        'ebuy.directives': 'scripts/directives',
        'ebuy.services': 'scripts/services',
        'ebuy.config': 'scripts/config'
    },

    shim: {
        'jQuery': {
            exports: 'jQuery'
        },
        'ionic': {
            deps: ['cordova', 'jQuery'],
            exports: 'ionic'
        },
        'localStorage': {
            deps: ['ionic'],
            exports: 'localStorage'
        }
    }
});


require([

    'cordova',
    'ionic',
    'ebuy.config',
    'app'

], function() {

    'use strict';

    angular.bootstrap(document.body, ['ebuy']);
});
