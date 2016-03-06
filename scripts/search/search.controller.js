(function () {

    'use strict';
    
    /*
        TRIP Object
        {
            city: "",
            country: "",
            price: "",
            updating: "updating",
            flights: [
                {
                    "destinationLocation": "CPH",
                    "originLocation": "TXL",
                    "airline": "",
                    "price": "",
                    "departure": "",
                    "arrival": "",
                    "booking link": ""
                },
                {
                    "destinationLocation": "CPH",
                    "originLocation": "TXL",
                    "airline": "",
                    "price": "",
                    "departure": "",
                    "arrival": "",
                    "booking link": ""
                }
                
            ],
            hotel: 
                {
                    "avgPrice": ""
                }
        }
    */

    angular
        .module('app.search')
        .controller('searchCtrl', searchCtrl);

    function searchCtrl($scope, $state, $stateParams, $http, $q) {
        console.log('searchCTRL exec');
        
        $scope.serverURL = "https://floating-harbor-60669.herokuapp.com/";
        $scope.appURL = "http://localhost:8000/#/searched/";
        $scope.startDate;
        $scope.endDate;
        
        $scope.trips = [];
        $scope.searchID = null;
        $scope.searchURL = null;
        
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
        
        $scope.startDate = moment(startDate).format("YYYY-MM-DD");
        $scope.endDate = moment(endDate).format("YYYY-MM-DD");
        
        getSearchResults($http, $q, $scope, $scope.startDate, $scope.endDate, $scope.friend)
            .then(function(flights) {
                
                $scope.trips = flights;
                $scope.searchID = flights.searchId;
                $scope.searchURL = $scope.appURL + flights.searchId;
                mapTrips($scope);
                //now request the details
                getDetailedResults($http, $q, $scope).then(function(flights) {
                    console.log('got some details');
                });
            });


        $scope.selectTrip = function(trip) {
            $state.go('booking.flights', { 'trip' : JSON.stringify(trip) });
        }
    }
    
    function mapTrips(scope) {
        scope.trips.destinations.forEach(function(trip) {
            trip.updating="updating";
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
    
    function getDetailedResults(http, q, scope) {
        var deferred = q.defer();

        http
            .get('/api/search/details/'+scope.searchID)
            .success(function(detailList) {
                deferred.resolve(detailList);
            })
            .error(function() {
                deferred.reject();
            });

        return deferred.promise;
    }

})();