'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('distance', {
                url: '/distance',
                views: {
                    'header@': {
                        templateProvider: function ($templateCache) {
                            return $templateCache.get('modules/_header/views/index.html');
                        },
                        controller: 'HeaderController'
                    },
                    'content@': {
                        templateProvider: function ($templateCache) {
                            return $templateCache.get('modules/Distance/views/index.html');
                        },
                        controller: 'DistanceController'
                    },
                    'footer@': {
                        templateProvider: function ($templateCache) {
                            return $templateCache.get('modules/_footer/views/index.html');
                        },
                        controller: 'FooterController'
                    }
                },
                data: {
                    permissions: {
                        only: 'isAuthorized',
                        redirectTo: '/'
                    }
                }
            })
    });