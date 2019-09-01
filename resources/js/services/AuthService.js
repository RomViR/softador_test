'use strict';

angular.module('app')
    .factory('AuthService', Service);

    function Service($http, authManager, $q, $rootScope, $timeout, $location, $state) {
        var service = {};

        service.login = function(email, password, callback) {
            $http({
                url:'/api/auth/login',
                skipAuthorization: true,
                method: 'POST',
                data: {
                    email: email,
                    password: password
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function successCallback(response) {
                if (response.data.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);
                    callback(true);
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                callback(false);
            })
        };

        service.logout = function(callback) {
            $rootScope.loggingOut = true;

            if(!localStorage.getItem('access_token')) {
                authManager.unauthenticate();
            }

            var token = localStorage.getItem('access_token');

            $http({
                url:'/api/auth/logout',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization' : 'Bearer ' + token
                }
            }).then(function successCallback(response) {
                localStorage.removeItem('access_token');

                $state.go('/');
                authManager.unauthenticate();

                callback(true);
                $rootScope.loggingOut = false;
            }, function () {
                $rootScope.loggingOut = false;
            });
        };

        service.register = function(email, password, callback) {
            $http({
                url:'/api/auth/register',
                skipAuthorization: true,
                method: 'POST',
                data: {
                    email: email,
                    password: password
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function successCallback(response) {
                if (response.data.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);
                    callback(true);
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                callback(false);
            })
        };

        service.refreshToken = function(callback) {
            if(!localStorage.getItem('access_token')) {
                authManager.unauthenticate();
                return false;
            }

            var token = localStorage.getItem('access_token');

            $http({
                url:'/api/auth/refresh',
                method: 'POST',
                skipAuthorization: true,
                cancelable : true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : 'Bearer ' + token
                }
            }).then(function successCallback(response) {
                if (response.data.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);
                    callback(true);
                }
            }, function errorCallback(response) {
                authManager.unauthenticate();

                $state.go('/');

                localStorage.removeItem('access_token');

                callback(false);
            })
        };

        service.forgot = function($email, callback) {
            $http({
                url:'/api/auth/forgot-password',
                skipAuthorization: true,
                method: 'POST',
                data: {
                    email: $email
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function successCallback(response) {
                callback(response);
            }, function errorCallback(response) {
                callback(false);
            });
        };

        service.setPasswordForgot = function($token, $password, callback) {
            $http({
                url:'/api/auth/set-forgot-password',
                skipAuthorization: true,
                method: 'POST',
                data: {
                    token: $token,
                    password: $password
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function successCallback(response) {
                if (response.data.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);
                    callback(response);
                }
            }, function errorCallback(response) {
                callback(false);
            })
        };

        return service;
    }