'use strict';

angular.module('app')
    .factory('DistanceService', function ($resource, DataUtils) {
        var sv = $resource('/api/distance', {}, {
            options: {
                url: '/api/distance/options',
                method : 'GET'
            },
            calculate: {
                url: '/api/distance/calculate',
                method : 'POST',
                transformRequest: function (data) {
                    return DataUtils.preparePostForServer(data);
                }
            }
        });

        return sv;
    });
