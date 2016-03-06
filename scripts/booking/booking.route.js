(function () {

    'use strict';

    angular
        .module('app.booking')
        .config(routerConfig);

    function routerConfig($stateProvider) {

        $stateProvider
            .state('booking', {
                abstract: true,
                parent: 'root',
                templateUrl: 'templates/booking/overview.html',
                controller: 'bookingCtrl'
            })
            .state('booking.flights', {
                url: "/booking/flights/:trip",
                templateUrl: 'templates/booking/flights.html',
                controller: 'bookingCtrl'
            })
            .state('booking.rental', {
                url: "/booking/rental",
                templateUrl: 'templates/booking/rental.html',
                controller: 'bookingCtrl'
            });
    }
})();