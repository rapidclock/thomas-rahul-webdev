/**
 * Created by RT on 10/10/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .config(Config);

    function Config($routeProvider, $sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '*://www.youtube.com/**'
        ]);
        var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get('/api/loggedin').success(function(user) {
                $rootScope.errorMessage = null;
                if (user !== '0' || user !== null) {
                    $rootScope.currentUser = user;
                    deferred.resolve();
                } else {
                    deferred.reject();
                    $location.url('/');
                }
            });
            return deferred.promise;
        };
        $routeProvider
            .when('/', {
                templateUrl : "/assignment/views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when('/register', {
                templateUrl : "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when('/login', {
                templateUrl : "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when('/test', {
                templateUrl : "views/test.html",
                controller: "NewWidgetController",
                controllerAs: "model"
            })
            .when('/error/404', {
                templateUrl : "misc/error.landing.404.html"
            })
            .when('error/500', {
                templateUrl : "misc/error.landing.500.html"
            })
            .when('/user', {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when('/user/:uid', {
                templateUrl : "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when('/user/:uid/website', {
                templateUrl : "views/website/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model"
            })
            .when('/user/:uid/website/new', {
                templateUrl : "views/website/website-new.view.client.html",
                controller: "NewWebsiteController",
                controllerAs: "model"
            })
            .when('/user/:uid/website/:wid', {
                templateUrl : "views/website/website-edit.view.client.html",
                controller: "EditWebsiteController",
                controllerAs: "model"
            })
            .when('/user/:uid/website/:wid/page', {
                templateUrl : "views/page/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model"
            })
            .when('/user/:uid/website/:wid/page/new', {
                templateUrl : "views/page/page-new.view.client.html",
                controller: "NewPageController",
                controllerAs: "model"
            })
            .when('/user/:uid/website/:wid/page/:pid', {
                templateUrl : "views/page/page-edit.view.client.html",
                controller: "EditPageController",
                controllerAs: "model"
            })
            .when('/user/:uid/website/:wid/page/:pid/widget', {
                templateUrl : "views/widget/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model"
            })
            .when('/user/:uid/website/:wid/page/:pid/widget/new', {
                templateUrl : "views/widget/widget-chooser.view.client.html",
                controller: "NewWidgetController",
                controllerAs: "model"
            })
            .when('/user/:uid/website/:wid/page/:pid/widget/create/:wtype', {
                templateUrl : "views/widget/widget-new.view.client.html",
                controller: "CreateWidgetController",
                controllerAs: "model"
            })
            .when('/user/:uid/website/:wid/page/:pid/widget/:wgid', {
                templateUrl : "views/widget/widget-edit.view.client.html",
                controller: "EditWidgetController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo : "/"
            });
    }
})();