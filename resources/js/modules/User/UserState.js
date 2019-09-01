'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('set-forgot-password', {
                url: '/set-forgot-password/:token',
                views: {
                    'header@': {
                        templateProvider: function ($templateCache) {
                            return $templateCache.get('modules/_header/views/index.html');
                        },
                        controller: 'HeaderController'
                    },
                    'content@': {
                        templateProvider: function ($templateCache) {
                            return $templateCache.get('modules/User/views/set_forgot_password.html');
                        },
                        controller: 'SetForgotPasswordController'
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