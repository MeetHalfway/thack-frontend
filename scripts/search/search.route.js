(function () {

    'use strict';

    angular
        .module('app.search')
        .config(routerConfig);

    function routerConfig($stateProvider) {

        $stateProvider.state('search', {
            url: '/search',
            parent: 'root',
            templateUrl: 'templates/search/search.html',
            controller: 'introCtrl'
        });
    }
})();