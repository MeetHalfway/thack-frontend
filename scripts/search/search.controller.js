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
        
        $scope.serverURL = "http://localhost:8080/";
        $scope.appURL = "http://localhost:8000/#/searched/";
        $scope.startDate;
        $scope.endDate;
        $scope.ready = false;
        
        $scope.fullTrips = [];
        
        $scope.trips = [];
        $scope.searchID = null;
        $scope.searchURL = null;

        if(!$rootScope.friend && $stateParams.friend)
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
        if(!$rootScope.trips) {
            getSearchResults($http, $q, $scope, $scope.startDate, $scope.endDate, $scope.friend)
                .then(function (flights) {

                    $rootScope.trips = $scope.trips = flights;
                    $scope.searchID = flights.searchId;

                    $scope.searchURL = $scope.appURL + flights.searchId;
                mapTrips($http, $q, $scope);
                    //now request the details
                    console.log("getting more details");
                    getDetailedResults($http, $q, $scope).then(function (detailedflights) {
                        console.log('got some details');
                        updateTripDetails($scope, detailedflights);
                        $rootScope.fullTrips = $scope.fullTrips;
                    });
            
                
                });
        }

        $scope.selectTrip = function(trip) {
            $state.go('booking.flights', { 'trip' : JSON.stringify(trip) });
        };
        
        $scope.redoSearch = function() {
            console.log('redo');
            $scope.fullTrips = [];

            getSearchResults($http, $q, $scope, $scope.startDate, $scope.endDate, $scope.friend)
                .then(function(flights) {

                    $rootScope.trips = $scope.trips = flights;
                    $scope.searchID = flights.searchId;

                    $scope.searchURL = $scope.appURL + flights.searchId;
                    mapTrips($http, $q, $scope);
                    //now request the details
                    console.log("getting more details");
                    getDetailedResults($http, $q, $scope).then(function(detailedflights) {
                        console.log('got some details');
                        updateTripDetails($scope, detailedflights);
                        $rootScope.fullTrips = $scope.fullTrips;
                    });
                });
        };

        $scope.getLeftMargin = function(trip, travellerIndex) {

            if(trip && trip.flights && trip.flights[travellerIndex].indate) {
                var start = trip.flights[travellerIndex].indate;
                start = start.substring(start.length - 8, start.length - 6);

                return start / 72 * 100;
            }

            return 0;
        };

        $scope.getDuration = function(trip, travellerIndex) {
            if(trip && trip.flights && trip.flights[travellerIndex].indate) {
                var start = trip.flights[travellerIndex].indate;
                var arrival = trip.flights[travellerIndex].outdate;

                return Math.round(Math.abs(moment(start, "YYYY-MM-DDThh:mm")
                    .diff(moment(arrival, "YYYY-MM-DDThh:mm"), 'hours')));
            }

            return 0;
        };

        $scope.getTimeTogether = function(trip) {
            if(trip && trip.flights && trip.flights[0].indate) {

                var arrivalOne = trip.flights[0].indate;
                var arrivalTwo = trip.flights[1].indate;

                var departureOne = trip.flights[0].outdate;
                var departureTwo = trip.flights[1].outdate;

                var arrival = moment(arrivalOne, "YYYY-MM-DDThh:mm")
                    .isBefore(moment(arrivalTwo, "YYYY-MM-DDThh:mm")) ? arrivalTwo : arrivalOne;

                var departure = moment(departureOne, "YYYY-MM-DDThh:mm")
                    .isBefore(moment(departureTwo, "YYYY-MM-DDThh:mm")) ? departureOne : departureTwo;

                return Math.round(Math.abs(moment(departure, "YYYY-MM-DDThh:mm")
                    .diff(moment(arrival, "YYYY-MM-DDThh:mm"), 'hours')));
            }
        };

        $scope.getWidth = function(trip, travellerIndex) {

            var duration = $scope.getDuration(trip, travellerIndex);
            return duration / 72 * 100;
        };

        $scope.getFormattedDay = function(trip, dayIndex, format) {

            if(trip && trip.flights && trip.flights[0].indate) {

                var firstDay = moment(trip.flights[0].indate, "YYYY-MM-DDThh:mm");
                var secondDay = firstDay.clone().add(1, 'day');
                var thirdDay = secondDay.clone().add(1, 'day');

                var dayArray = [
                    firstDay,
                    secondDay,
                    thirdDay
                ];

                return format == 1 ? dayArray[dayIndex].format("DD.MM.") : dayArray[dayIndex].format("dddd")
            }
        }
    }
    
    function mapTrips(http, q, scope) {

        scope.trips.destinations.forEach(function(destination) {
            //trip.updating="updating";
            
            getHotelResults(http, q, scope, destination.city).then(function(hotelprice) {
                console.log('getting hotel price for '+destination.city);
                console.log(hotelprice);
                if (hotelprice == null) {
                    hotelprice = 'no data';
                }
                
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
                            "avgPrice": hotelprice
                        }
                });                
            });
            

        });
    }
    
    function updateTripDetails(scope, detailedflights) {
        var i = 0;
        scope.fullTrips.forEach(function(trip) {
            if (detailedflights[i] != undefined) {
                trip.updating = 'Checked';
                
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
                'http://localhost:8080/search',
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
    
    function getHotelResults(http, q, scope, city) {
        var deferred = q.defer();

        http
            .post(
                'https://floating-harbor-60669.herokuapp.com/hotelsAvarage', 
                {
                    "location": city,
                    "startDate": scope.startDate,
                    "endDate": scope.endDate
                }
            )
            .success(function(hotelprice) {
                deferred.resolve(hotelprice);
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
            .get('http://localhost:8080/search/details/' + scope.searchID)
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