'use strict';

angular.module('app').controller('HomeController',
	function ($scope, $rootScope,  $state, $stateParams, AuthService, toastr) {
		$scope.email = $scope.password =
			$scope.email_error = $scope.password_error = '';

		$scope.login = function() {
			AuthService.login($scope.email, $scope.password, function(response) {
				if (response) {
					$state.go('distance');
				}
			});
		};

		$scope.register = function() {
			if ($scope.html5Validate(document.getElementById('login-form'))) {
				AuthService.register($scope.email, $scope.password, function(response) {
					if (response) {
						$state.go('distance');
					}
				});
			}
		};

		$scope.forgot = function() {
			if ($scope.html5Validate(document.getElementById('inp-email'))) {
				AuthService.forgot($scope.email, function(response) {
					if (response) {
						toastr.success('We have sent you an email ' +
							'with a link to reset your password', {timeOut: 60000});
					}
				});
			}
		};

		$scope.html5Validate = function(target) {
			if (!target.checkValidity()) {
				document.getElementById('btn-login').click();
				return false;
			}
			return true;
		};
	});