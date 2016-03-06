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

    function searchCtrl($rootScope, $scope, $state, $stateParams, $http, $q) {
        console.log('searchCTRL exec');
        
        $scope.serverURL = "https://floating-harbor-60669.herokuapp.com/";
        $scope.appURL = "http://localhost:8000/#/searched/";
        $scope.startDate;
        $scope.endDate;
        $scope.ready = false;
        
        $scope.fullTrips = [];
        
        $scope.trips = [];
        $scope.searchID = null;
        $scope.searchURL = null;

        $rootScope.friend = $scope.friend = JSON.parse($stateParams.friend);

        if($rootScope.trips)
            $scope.trips = $rootScope.trips;
        
        if($rootScope.fullTrips)
            $scope.fullTrips = $rootScope.fullTrips;

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
        
//        $scope.redoSearch;
        getSearchResults($http, $q, $scope, $scope.startDate, $scope.endDate, $scope.friend)
            .then(function(flights) {

                $rootScope.trips = $scope.trips = flights;
                $scope.searchID = flights.searchId;

                $scope.searchURL = $scope.appURL + flights.searchId;
                mapTrips($scope);
                //now request the details
                console.log("getting more details");
                getDetailedResults($http, $q, $scope).then(function(detailedflights) {
                    console.log('got some details');
                    updateTripDetails($scope, detailedflights);
                    $rootScope.fullTrips = $scope.fullTrips;
//                    $scope.buttonActive = "";
                });
            });


        $scope.selectTrip = function(trip) {
            $state.go('booking.flights', { 'trip' : JSON.stringify(trip) });
        }
        
        $scope.redoSearch = function() {
            console.log('redo');
            $scope.fullTrips = [];

            getSearchResults($http, $q, $scope, $scope.startDate, $scope.endDate, $scope.friend)
                .then(function(flights) {

                    $rootScope.trips = $scope.trips = flights;
                    $scope.searchID = flights.searchId;

                    $scope.searchURL = $scope.appURL + flights.searchId;
                    mapTrips($scope);
                    //now request the details
                    console.log("getting more details");
                    getDetailedResults($http, $q, $scope).then(function(detailedflights) {
                        console.log('got some details');
                        updateTripDetails($scope, detailedflights);
                        $rootScope.fullTrips = $scope.fullTrips;
                    });
                });
        }
    }
    
    
    
    function mapTrips(scope) {
        scope.trips.destinations.forEach(function(destination) {
            //trip.updating="updating";
            scope.fullTrips.push({
                city: destination.city,
                country: destination.country,
                price: destination.minPrice,
                updating: "updating",
                flights: [
                    {
                        "destinationLocation": destination.destinationLocation,
                        "originLocation": destination.originLocations[0],
//                        "airline": "",
                        "price": "",
                        "indate": "",
                        "induration": "",
                        "outdate": "",  
                        "outduration": "",
                        "booking_link": ""
                    },
                    {
                        "destinationLocation": destination.destinationLocation,
                        "originLocation": destination.originLocations[1],
//                        "airline": "",
                        "price": "",
                        "indate": "",
                        "induration": "",
                        "outdate": "",  
                        "outduration": "",
                        "booking_link": ""
                    }

                ],
                hotel: 
                    {
                        "avgPrice": ""
                    }
            });
        });
    }
    
    function updateTripDetails(scope, detailedflights) {
        var i = 0;
        scope.fullTrips.forEach(function(trip) {
            if (detailedflights[i] != undefined) {
                trip.updating = 'done';
                
                trip.flights[0].price =         detailedflights[i][0].price;
                trip.flights[0].indate =        detailedflights[i][0].outbound.departureTime;
                trip.flights[0].induration =    detailedflights[i][0].outbound.duration;
                trip.flights[0].outdate =       detailedflights[i][0].inbound.departureTime;
                trip.flights[0].outduration =   detailedflights[i][0].inbound.duration;
                trip.flights[0].booking_link =  detailedflights[i][0].bookingLink;
                
//                console.log(detailedflights[i][0].bookingLink);
//                console.log(detailedflights[i][1].bookingLink);
                
                trip.flights[1].price =         detailedflights[i][1].price;
                trip.flights[1].indate =        detailedflights[i][1].outbound.departureTime;
                trip.flights[1].induration =    detailedflights[i][1].outbound.duration;
                trip.flights[1].outdate =       detailedflights[i][1].inbound.departureTime;
                trip.flights[1].outduration =   detailedflights[i][1].inbound.duration;
                trip.flights[1].booking_link =  detailedflights[i][1].bookingLink;
                
                trip.price = trip.flights[0].price + trip.flights[1].price;
                i++;
            }                            
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
        scope.ready = false;
        http
            .get('https://floating-harbor-60669.herokuapp.com/search/details/'+scope.searchID)
            .success(function(detailList) {
                deferred.resolve(detailList);
                scope.ready = true;
            })
            .error(function() {
                deferred.reject();
            });

        return deferred.promise;
    }

})();