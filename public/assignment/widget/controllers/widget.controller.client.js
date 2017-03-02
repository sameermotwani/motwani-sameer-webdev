(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);
    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.widgetId = $routeParams["wgid"];
        vm.getTrustedHtml = getTrustedHtml;
        vm.getYouTubeEmbedUrl=getYouTubeEmbedUrl;
        vm.updateOrder=updateOrder;

        function init() {
            WidgetService
                .findWidgetsByPageId(vm.pageId)
                .success(function (response) {
                    vm.widgets = response;
                });
            // for (i in vm.widgets) {
            //     if (vm.widgets[i].widgetType == "YOUTUBE") {
            //         vm.widgets[i].trust_url = $sce.trustAsResourceUrl(vm.widgets[i].url);
            //     }
            // }

            // $('#wid-list').sortable({
            //     axis: 'y',
            //     cursor: "move",
            //     handle: ".glyphicon-align-justify"
            //     // scroll: false
            // });

        }

        init();

        function getYouTubeEmbedUrl(widgetUrl) {
            console.log(widgetUrl);
            var urlParts = widgetUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/"+id;
            console.log("url");
            return $sce.trustAsResourceUrl(url);

        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function updateOrder(startIndex,endIndex){
            WidgetService.updateWidgetsOrder(vm.pageId,startIndex,endIndex)
                .success(function(status){
                    vm.message = "Widgets order successfully updated";
                })
                .error(function(err){
                    vm.error= "Widgets order could not be updated";
                });
        }
    }

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.createWidget = createWidget;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.widgetId = $routeParams["wgid"];

        function createWidget(widgetType) {
            var newWidget = {"widgetType": widgetType};
            switch (widgetType) {
                case "HEADER":
                    newWidget.size = 1;
                    break;
                case "IMAGE":
                    newWidget.width = "100%";
                    break;
                case "YOUTUBE":
                    newWidget.width = "100%";
                    break;
                default:
            }
            console.log("here");
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (response) {
                    var newWidget = response;
                    if(newWidget){
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+newWidget._id);
                    }
                });
        }
    }

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.widgetId = $routeParams["wgid"];
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function init() {
            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function (response) {
                    vm.widget = response;
                });
        }

        init();

        function updateWidget(widget) {
            console.log("widget");
            console.log(widget);
            WidgetService
                .updateWidget(vm.widgetId, widget)
                .success(function (response) {
                    var updatedWidgetObject = response;
                    if(updatedWidgetObject){
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                    }
                });
        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .success(function (response) {
                    if(response){
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                    }
                });
        }

    }
})();