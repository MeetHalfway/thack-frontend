(function () {

    'use strict';

    angular
        .module('app.index')
        .config(routerConfig);

    function routerConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        /**
         * Resolve global application-wide data at here
         */
        $stateProvider.state('root', {
            abstract: true,
            template: '<div ui-view></div>',
            resolve: {
                globalConfig: function () {
                    return {};
                }
            }
        });

//        $stateProvider.state('index', {
             //            url: '/index',
             //            parent: 'root',
             //            views: {
             //                '': {
             //                    templateUrl: 'templates/index/index.html',
             //                    controller: 'indexCtrl'
             //                },
             //                'search@index': {
             //                    templateUrl: 'templates/search/search.html',
             //                    controller: 'indexCtrl',
             //                    resolve: {
             //                        searchFormData: getDefaultData
             //                    }
             //                }
             //            }
             //        });

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
                //                users: loadUsers
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