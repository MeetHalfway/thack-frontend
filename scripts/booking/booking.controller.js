(function () {

    'use strict';

    angular
        .module('app.booking')
        .controller('bookingCtrl', bookingCtrl);

    function bookingCtrl($scope, $state, $stateParams) {

        if($stateParams.trip && typeof $stateParams.trip == "string")
            $scope.trip = JSON.parse($stateParams.trip);
        else
            $scope.trip = $stateParams.trip;

        $scope.backToSearch = function() {
            $state.go('search')
        }
    }

})();