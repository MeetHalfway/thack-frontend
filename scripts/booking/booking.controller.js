(function () {

    'use strict';

    angular
        .module('app.booking')
        .controller('bookingCtrl', bookingCtrl);

    function bookingCtrl($rootScope, $scope, $state, $stateParams) {

        if($stateParams.trip && typeof $stateParams.trip == "string") {
            console.log("Parsing  trip...");

            $rootScope.selectedTrip = $scope.trip = JSON.parse($stateParams.trip);
        }
        else {
            console.log("Cannot do anything. Using rootScope.");

            $scope.trip = $rootScope.selectedTrip;
        }

        $scope.backToSearch = function() {
            $rootScope.selectedTrip = null;

            $state.go('search')
        };

        $scope.getArrivalTime = function(trip, outbound, peopleIndex) {

            var departureTime = outbound ? trip.flights[peopleIndex].indate :
                trip.flights[peopleIndex].outdate;

            var duration = outbound ? trip.flights[peopleIndex].induration :
                trip.flights[peopleIndex].outduration;

            departureTime = moment(departureTime, "YYYY-MM-DDThh:mm");
            duration = moment.duration(duration, 'minutes');

            var arrivalTime = departureTime.clone().add(duration);

            return arrivalTime.format("H:mm");
        };

        $scope.getDepartureTime = function(trip, outbound, peopleIndex) {

            var departureTime = outbound ? trip.flights[peopleIndex].indate :
                trip.flights[peopleIndex].outdate;

            departureTime = moment(departureTime, "YYYY-MM-DDThh:mm");

            return departureTime.format("H:mm");
        };

        /*
        $scope.trip = function(trip) {
            $state.go('booking.flights', { 'trip' : JSON.stringify(trip) });
        };
        
        $scope.rentals = function() {
            $state.go('search')
        };

        */
    }

})();