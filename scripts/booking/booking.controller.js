(function () {

    'use strict';

    angular
        .module('app.booking')
        .controller('bookingCtrl', bookingCtrl);

    function bookingCtrl($rootScope, $scope, $state, $stateParams) {
        
//        if($rootScope.trips)
//            $scope.trips = $rootScope.trips;

        if($stateParams.trip && typeof $stateParams.trip == "string")
            $scope.trip = JSON.parse($stateParams.trip);
        else
            $scope.trip = $stateParams.trip;

        $scope.backToSearch = function() {
            $state.go('search')
        }
        
//        $scope.trip = function(trip) {
//            $state.go('booking.flights', { 'trip' : JSON.stringify(trip) });
//        }
        
//        $scope.rentals = function() {
//            $state.go('search')
//        }
    }

})();