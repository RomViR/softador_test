'use strict';

angular.module('app')
    .controller('FooterController',
        function ($scope, $rootScope,  $state, toastr, $stateParams) {
            $scope.now = new Date();
        });