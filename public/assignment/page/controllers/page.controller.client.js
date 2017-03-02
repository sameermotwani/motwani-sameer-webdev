(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);
    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];

        function init() {
            PageService
                .findPagesByWebsiteId(vm.websiteId)
                .success(function (response) {
                    vm.pages = response;
                });
        }

        init();
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.createPage = createPage;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];

        function init() {
            //load pages for landscape showing list
            PageService
                .findPagesByWebsiteId(vm.websiteId)
                .success(function (response) {
                    vm.pages = response;
                });
        }

        init();

        function createPage(newPage) {
            PageService
                .createPage(vm.websiteId,newPage)
                .success(function (response) {
                    if(response){
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    }
                });
        }
    }

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];

        function init() {
            //load pages for landscape showing list
            PageService
                .findPageById(vm.pageId)
                .success(function (response) {
                    vm.page = response;
                    if(vm.page){
                        PageService
                            .findPagesByWebsiteId(vm.websiteId)
                            .success(function (response) {
                                vm.pages = response;
                            });
                    }
                });
        }

        init();

        function updatePage(page) {
            PageService
                .updatePage(vm.pageId, page)
                .success(function (response) {
                    var page = response;
                    if(page){
                        $location.url("user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    }
                });
        }

        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .success(function (response) {
                    if(response){
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    }
                });
        }

    }
})();