(function () {

    'use strict';

    angular
        .module('app.search')
        .config(routerConfig);

    function routerConfig($stateProvider) {

        $stateProvider.state('search', {
            url: '/search/:friend',
            parent: 'root',
            templateUrl: 'templates/search/search.html',
            controller: 'searchCtrl'
        });
    }
})();