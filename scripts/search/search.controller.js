(function () {

    'use strict';

    angular
        .module('app.search')
        .controller('searchCtrl', searchCtrl);

    function searchCtrl($scope, $stateParams, $http, $q) {
        console.log('searchCTRL exec');
        
        $scope.serverURL = "https://floating-harbor-60669.herokuapp.com/";
        
        $scope.friend = JSON.parse($stateParams.friend);
        
        var d = new Date();
        var n = d.getDay();
        
        var startDate = new Date();
        // add 5 days.
        startDate.setDate(d.getDate() + 5);
        
        var shift = 0;
        // if friday then use the date.
        // if other go to next friday.
        if (startDate.getDay() < 6) {
            shift = 5 - startDate.getDay();
            //4 then +1
            //5 then nothing
            //6 then + 5
        } else {
            shift = 5;
        }
        startDate.setDate(startDate.getDate() + shift);
        
        
        var endDate = new Date();
        endDate.setDate(startDate.getDate() + 2);
        
        startDate = moment(startDate).format("YYYY-MM-DD");
        endDate = moment(endDate).format("YYYY-MM-DD");
        
//        console.log(startDate);
//        console.log(endDate);
        
//        console.log($rootScope.serverURL);
        getSearchResults($http, $q, $scope, startDate, endDate, $scope.friend)
            .then(function(flights) {
                
                $scope.flights = flights;
            });

    }
    
    function getSearchResults(http, q, scope, startDate, endDate, friend) {
        var deferred = q.defer();

        http
            .post(
                'https://floating-harbor-60669.herokuapp.com/search', 
                {
                    'startDate': startDate,
                    'endDate': endDate,
                    'friend': friend
                }
        )
            .success(function(flightsList) {
                deferred.resolve(flightsList);
            })
            .error(function() {
                deferred.reject();
            });

        return deferred.promise;
    }

})();