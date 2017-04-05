(function(){
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider, $locationProvider,$httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/", {
                redirectTo: '/login',
                //resolve: { loggedin: checkLoggedin }

            })

            .when("/login", {
                templateUrl: "user/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model",
               // resolve: { loggedin: checkLoggedin }

            })
            .when("/register", {
                templateUrl: "user/templates/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model",
                //resolve: { loggedin: checkLoggedin }


            })
            .when("/user/:uid", {
                templateUrl: "user/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .when("/user/:uid/website", {
                templateUrl: "website/templates/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .when("/user/:uid/website/new", {
                templateUrl: "website/templates/website-new.view.client.html",
                controller: "NewWebsiteController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .when("/user/:uid/website/:wid", {
                templateUrl: "website/templates/website-edit.view.client.html",
                controller: "WebsiteEditController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })

            .when("/user/:uid/website/:wid/page", {
                templateUrl: "page/templates/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .when("/user/:uid/website/:wid/page/new", {
                templateUrl: "page/templates/page-new.view.client.html",
                controller: "NewPageController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .when("/user/:uid/website/:wid/page/:pid", {
                templateUrl: "page/templates/page-edit.view.client.html",
                controller: "EditPageController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .when("/user/:uid/website/:wid/page/:pid/widget", {
                templateUrl: "widget/templates/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .when("/user/:uid/website/:wid/page/:pid/widget/new", {
                templateUrl: "widget/templates/widget-chooser.view.client.html",
                controller: "NewWidgetController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .when("/user/:uid/website/:wid/page/:pid/widget/:wgid", {
                templateUrl: "widget/templates/widget-edit.view.client.html",
                controller: "EditWidgetController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .when("/user/:uid/website/:wid/page/:pid/widget/:wgid/flickr", {
                templateUrl: "widget/templates/widget-flickr-search.view.client.html",
                controller: "FlickrImageSearchController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .otherwise({
                    redirectTo: '/login',
                    //resolve: { loggedin: checkLoggedin }

                }
            );
    }

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/');
            }
        });
        return deferred.promise;
    };

})();