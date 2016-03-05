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
                templateUrl: 'templates/booking/overview.html'
            })
            .state('booking.flights', {
                // loaded into ui-view of parent's template
                url: "/booking/flights",
                templateUrl: 'templates/booking/flights.html'
            })
            .state('booking.rental', {
                // loaded into ui-view of parent's template
                url: "/booking/rental",
                templateUrl: 'templates/booking/rental.html'
            });

        /*
        $stateProvider.state('booking', {
                url: '/booking',
                parent: 'root',
                templateUrl: 'templates/booking/overview.html',
                controller: 'bookingCtrl',
                views: {
                    "rental@booking": {
                        url: '/rental',
                        templateUrl: 'templates/rental/list.html',
                        controller: 'rentalCtrl'
                    }
                }
            }
        );*/
    }
})();