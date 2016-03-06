(function () {

    'use strict';

    angular
        .module('app.index')
        .controller('indexCtrl', indexCtrl);

    function indexCtrl($rootScope, $scope, $http, $q, $state) {

        getProfile($http, $q)
            .then(function(profile) {
                $rootScope.profile = profile;
            });

        getFriends($http, $q)
            .then(function(friendsList) {
                friendsList.sort(function(a, b) {
                    if(a.first_name < b.first_name)
                       return -1;
                    else if(a.first_name > b.first_name)
                        return 1;
                    return 0;
                });
                $rootScope.friends = friendsList;
            });

        $scope.proceed = function(friend) {
            console.log('proceed');
            $state.go('search', {
                "friend": JSON.stringify(friend)
            });
        }
    }

    function getFriends(http, q) {
        var deferred = q.defer();

        http
            .get('/api/friends')
            .success(function(friendsList) {
                deferred.resolve(friendsList);
            })
            .error(function() {
                deferred.reject();
            });

        return deferred.promise;
    }

    function getProfile(http, q) {
        var deferred = q.defer();

        http
            .get('/api/profile')
            .success(function(profile) {
                deferred.resolve(profile);
            })
            .error(function() {
                deferred.reject();
            });

        return deferred.promise;
    }
})();