'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('/', {
                url: '/',
                views: {
                    'header@': {
                        templateProvider: function ($templateCache) {
                            return $templateCache.get('modules/_header/views/index.html');
                        },
                        controller: 'HeaderController'
                    },
                    'content@': {
                        templateProvider: function ($templateCache) {
                            return $templateCache.get('modules/Home/views/index.html');
                        },
                        controller: 'HomeController'
                    },
                    'footer@': {
                        templateProvider: function ($templateCache) {
                            return $templateCache.get('modules/_footer/views/index.html');
                        },
                        controller: 'FooterController'
                    }
                }
            })
    });