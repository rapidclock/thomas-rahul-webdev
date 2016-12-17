(function () {
    angular
        .module('WebMessenger')
        .config(configure);

    function configure($routeProvider, $sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '*://www.youtube.com/**'
        ]);
        var checkLoggedIn = function ($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get('/rest/loggedin')
                .success(function (user) {
                    $rootScope.errorMessage = null;
                    if (user !== '0' && user !== null) {
                        $rootScope.currentUser = user;
                        deferred.resolve();
                    } else {
                        deferred.reject();
                        $location.url('/login');
                    }
                })
                .error(function (error) {
                    console.log(error);
                    $location.url('/login');
                });
            return deferred.promise;
        };
        $routeProvider
            .when('/', {
                templateUrl: "./views/access/login.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when('/login', {
                templateUrl: "./views/access/login.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when('/register', {
                templateUrl: "./views/access/register.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when('/user', {
                templateUrl: "./views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedIn}
            })
            .when('/user/:uid', {
                templateUrl: "./views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedIn}
            })
            .when('/user/:uid/friends', {
                templateUrl: "./views/user/friend.list.view.client.html",
                controller: "FriendListController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedIn}
            })
            .when('/user/:uid/ext/:extid', {
                templateUrl: "./views/user/ext.profile.view.client.html",
                controller: "ExtProfileController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedIn}
            })
            .when('/user/:uid/chat', {
                templateUrl: "./views/comm/chat.home.view.client.html",
                controller: "ChatController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedIn}
            })
            .when('/user/:uid/chat/:cid', {
                templateUrl: "./views/comm/chat.home.view.client.html",
                controller: "ChatController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedIn}
            })
            .otherwise({
                redirectTo: "/temp"
            });
    }
})();