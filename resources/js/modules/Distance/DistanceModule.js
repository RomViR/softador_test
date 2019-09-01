'use strict';

angular.module('app').controller('DistanceController',
	function ($scope, $rootScope,  $state, $stateParams, DistanceService, toastr) {
		$scope.data = [];
		$scope.params = {
			cars: [],
			dates: {
				start: null,
				end: null
			}
		};

		$scope.loadOptions = function() {
			$rootScope.utils.loadingScreen(true);
			DistanceService.options(function(resp) {
				$scope.options = resp.data;
				$rootScope.utils.loadingScreen(false);
			}, function(err) {
				$rootScope.utils.loadingScreen(false);
			});
		};

		$scope.calculate = function() {
			if ($scope.validate()) {
				$rootScope.utils.loadingScreen(true);

				DistanceService.calculate($scope.params, function(responce) {
					$scope.data = responce.data;
					$rootScope.utils.loadingScreen(false);
				}, function(err) {
					$rootScope.utils.loadingScreen(false);
				});
			}
		};

		$scope.addAll = function() {
			$scope.params.cars = $scope.options.cars.map(function(car) {
				return car._id;
			})
		};

		$scope.removeAll = function() {
			$scope.params.cars = [];
		};

		$scope.validate = function() {
			if (!$scope.params.cars.length) {
				toastr.warning('Please select vehicle(s)');
				return false;
			}
			if (!$scope.params.dates.start || !$scope.params.dates.end ||
				$scope.params.dates.start > $scope.params.dates.end
			) {
				toastr.warning('Please select a valid date range');
				return false;
			}

			return true;
		};

		$scope.loadOptions();
	});