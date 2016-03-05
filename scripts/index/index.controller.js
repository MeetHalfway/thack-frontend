(function () {

    'use strict';

    angular
        .module('app.index')
        .controller('indexCtrl', indexCtrl);

    function indexCtrl($scope, $http, $q) {

        getFriends($http, $q)
            .then(function(friendsList) {
                $scope.friends = friendsList;
            });

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
})();