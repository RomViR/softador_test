'use strict';

angular.module('app').service('AppUtilities', function(AuthService) {
	this.loadingScreen = function(show) {
		show = show ? 'add' : 'remove';
		$('#loading-screen')[show + 'Class']('show');
	};

	this.logout = AuthService.logout;
});
