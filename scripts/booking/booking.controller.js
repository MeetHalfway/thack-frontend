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