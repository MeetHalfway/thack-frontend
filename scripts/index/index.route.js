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
            controller: 'indexCtrl',
            resolve: {
                friends: loadFriends
            }
        });
    }

    function loadFriends() {
        return [
            {
                "_id": "da4b9237bacccdf19c0760cab7aec4a8359010b0",
                "first_name": "Nele",
                "second_name": "Kueuets",
                "email": "nele@iswonderful.com",
                "picture": "https://scontent-ams3-1.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/12801196_1082993441740274_6720207800347496210_n.jpg?oh=538248af8aac091ebfe0d8820cea3eef&oe=5756666C",
                "location": "Budapest, Hungary"

            },
            {
                "_id": "77de68daecd823babbb58edb1c8e14d7106e83bb",
                "first_name": "Alfonso",
                "second_name": "Jennings",
                "email": "Alfonso@iswonderful.com",
                "picture": "https://scontent-ams3-1.xx.fbcdn.net/hphotos-xal1/v/t1.0-9/12341531_10206702944004078_675065463407394735_n.jpg?oh=ca7be18c005bc76f8a14245f12d1642e&oe=57549315",
                "location": "Paris, France"

            },
            {
                "_id": "1b6453892473a467d07372d45eb05abc2031647a",
                "first_name": "Jin",
                "second_name": "Maxim",
                "email": "Jin@iswonderful.com",
                "picture": "https://scontent-ams3-1.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/12294637_10205226451650812_4130130515853753206_n.jpg?oh=48dc6a88e285cdcb5558b41d873e68fb&oe=5768DF38",
                "location": "Paris, France"

            },
            {
                "_id": "ac3478d69a3c81fa62e60f5c3696165a4e5e6ac4",
                "first_name": "Karl",
                "second_name": "Kolla",
                "email": "karl@iswonderful.com",
                "picture": "https://scontent-ams3-1.xx.fbcdn.net/hphotos-xpl1/v/t1.0-9/1914537_909542345809478_419891855926471111_n.jpg?oh=5405114a9f57b0940933ad9a351dbf1e&oe=575926C2",
                "location": "Paris, France"

            }
        ];
    }
})();