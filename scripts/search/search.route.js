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

        $stateProvider.state('intro', {
            url: '/',
            parent: 'root',
            templateUrl: 'templates/intro/intro.html',
            controller: 'introCtrl',
            resolve: {
                //users: loadUsers
            }
        });

        $stateProvider.state('search', {
            url: '/list',
            parent: 'root',
            templateUrl: 'templates/intro/friendlist.html',
            controller: 'introCtrl',
            resolve: {
                users: loadUsers
            }
        });

        $stateProvider.state('state2', {
            url: '/state2',
            parent: 'root',
            templateUrl: 'templates/intro/intro.html',
            controller: 'introCtrl',
            resolve: {
                //users: loadUsers
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
        retur
    }
})();