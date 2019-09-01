'use strict';

angular.module('app')
    .controller('SetForgotPasswordController',
        function ($scope, $rootScope,  $state, $stateParams, AuthService, toastr) {
            var token = $stateParams.token;
            $scope.password = '';

            $scope.setPasswordForgot = function () {
                AuthService.setPasswordForgot(token, $scope.password, function(response) {
                    if (response) {
                        $state.go('distance');
                    } else {
                        toastr.error('Token is no longer valid. ' +
                            'Please try resetting your password again.', {timeOut: 60000});
                        $state.go('/');
                    }
                });
            }

        });