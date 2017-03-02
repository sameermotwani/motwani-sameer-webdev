(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("WebsiteEditController", EditWebsiteController);
    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        //vm.userId = $routeProvider.userId;

        function init() {
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (response) {
                    vm.websites = response;
                });
        }

        init();
    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.createWebsite = createWebsite;
        vm.userId = $routeParams["uid"];

        function init() {
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (response) {
                    vm.websites = response;
                });
        }

        init();

        function createWebsite(website) {
            WebsiteService
                .createWebsite(vm.userId,website)
                .success(function (response) {
                    var newWebsite = response;
                    if(newWebsite){
                        $location.url("/user/"+vm.userId+"/website");
                    }
                })
                .error(function (response) {
                    vm.error = "Could not create website, try again after some time";
                    return;
                });
        }
    }

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];

        function init() {
            //load websites for landscape showing list
            WebsiteService
                .findWebsitesById(vm.websiteId)
                .success(function (response) {
                    vm.website = response;
                    if(vm.website){
                        WebsiteService
                            .findWebsitesByUser(vm.userId)
                            .success(function (response) {
                                vm.websites = response;
                            });
                    }
                });
        }

        init();

        function updateWebsite(website) {
            console.log(website);
            WebsiteService
                .updateWebsite(vm.websiteId, website)
                .success(function (response) {
                    var website = response;
                    console.log("here");
                    $location.url("user/"+vm.userId+"/website")
                });
        }

        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .success(function (response) {
                    $location.url("/user/"+vm.userId+"/website");
                });
        }

    }
})();