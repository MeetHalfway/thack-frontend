(function () {

    'use strict';

    angular
        .module('app.search')
        .config(routerConfig);

    function routerConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        /**
         * Resolve global application-wide data at here
         */

        $stateProvider.state('search', {
            url: '/search',
            parent: 'root',
            templateUrl: 'templates/search/search.html',
            controller: 'introCtrl',
            resolve: {
                users: loadUsers
            }
        });


    }

    function getDefaultData() {
        return {
            destination: null,
            origin: null,
            date: null
        }
    }

    function getFriendlist() {
        return null;
    }
})();