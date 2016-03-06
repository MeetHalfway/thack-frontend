(function () {

    'use strict';

    angular
        .module('app.index')
        .controller('indexCtrl', indexCtrl);

    function indexCtrl($scope, $http, $q, $state) {
        

        getFriends($http, $q)
            .then(function(friendsList) {
                friendsList.sort(function(a, b) {
                    if(a.first_name < b.first_name)
                       return -1;
                    else if(a.first_name > b.first_name)
                        return 1;
                    return 0;
                });
                $scope.friends = friendsList;
            });

        $scope.proceed = function(friend) {
            console.log('proceed');
            $state.go('search', { "friend": JSON.stringify(friend) });
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
})();