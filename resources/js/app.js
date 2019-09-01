var app = angular.module('app', [
    'ui.router',
    'angular-jwt',
    'ngResource',
    'templates',
    'permission',
    'permission.ui',
    '720kb.datepicker',
    'toastr'
]);

app.run(function($transitions, authManager, $rootScope, $location, jwtHelper,
                  $state, $stateParams, AuthService, $q, PermPermissionStore, AppUtilities
) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.Math = Math;
    $rootScope.JSON = JSON;

    PermPermissionStore.definePermission('isAuthorized', function () {return authManager.isAuthenticated();});

    authManager.checkAuthOnRefresh();

    $transitions.onStart({}, function (trans) {
        var deferred = $q.defer();
        // Refresh token every location change
        if (!$rootScope.loggingOut && localStorage.getItem('access_token')) {
            AuthService.refreshToken(function (response) {
                if(!response) {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                }

                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    });

    $rootScope.utils = AppUtilities;
});

app.config(function Config($httpProvider, jwtOptionsProvider, $urlRouterProvider, $qProvider, jwtInterceptorProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);

    jwtInterceptorProvider.authHeader = 'Authorization';

    $urlRouterProvider.otherwise( function($injector,url) {
        var $state = $injector.get("$state");

        if(!url.$location.$$url) {
            $state.go('/');
            return false;
        }

        window.location.href = '/404';
    });

    $qProvider.errorOnUnhandledRejections(false);

    jwtOptionsProvider.config({
        tokenGetter: ['options', function(options) {
            return localStorage.getItem('access_token');
        }]
    });

    $httpProvider.interceptors.push('jwtInterceptor');
});

app.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        allowHtml: true,
        extendedTimeOut: 3000,
        timeOut: 3000,
        progressBar: true
    });
});

app.factory('responseInterceptor', function($q, $injector) {
    return {
        'response': function(response) {
            return response || $q.when(response);
        },

        'responseError': function(rejection) {
            var stateService = $injector.get('$state');
            var toastr = $injector.get('toastr');
            var rootScope = $injector.get('$rootScope');
            var d = $q.defer();

            if (rejection.status === 401) {
                stateService.go('/');
            }

            if(rejection.status === 400) {
                toastr.info(rejection.data, {timeOut: 60000});
            }

            if (rejection.status === 500) {
                toastr.error("Internal server error. Please try again later.", {timeOut: 60000});
            }

            if (rejection.status === 422) {
                var error = "";
                var data = [];

                if(typeof rejection === 'object') {
                    data = rejection.data.errors;
                } else {
                    data = rejection.data;
                }

                angular.forEach(data , function(value, key){
                    if(key !== "error" && key !== "error_array") {
                        error += value + "<br />";
                    }
                });
                toastr.error(error, {timeOut: 60000});
            }

            if (rejection.status === 403) {
                toastr.error("Action not authorized");
                d.reject("not authorized");
                stateService.go('/');
            }

            return $q.reject(rejection);
        }
    };
});

app.config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push('responseInterceptor');
    $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
}]);