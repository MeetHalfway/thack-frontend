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

        $stateProvider.state('index', {
            url: '/',
            parent: 'root',
            templateUrl: 'templates/index/index.html',
            controller: 'indexCtrl'
        });

        $stateProvider.state('list', {
            url: '/list',
            parent: 'root',
            templateUrl: 'templates/index/friendlist.html',
            controller: 'indexCtrl'
        });
    }
})();