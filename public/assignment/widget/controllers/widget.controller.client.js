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
        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
            for (i in vm.widgets) {
                if (vm.widgets[i].widgetType == "HTML") {
                    vm.widgets[i].html = $sce.trustAsHtml(vm.widgets[i].text);
                }
                else if (vm.widgets[i].widgetType == "YOUTUBE" || vm.widgets[i].widgetType == "IMAGE") {
                    vm.widgets[i].trust_url = $sce.trustAsResourceUrl(vm.widgets[i].url);
                }
            }
        }

        init();

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getYouTubeEmbedUrl(widgetUrl) {
            var urlParts = widgetUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/"+id;
            console.log(url);
            return $sce.trustAsResourceUrl(url);
            console.log("done");
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
            newWidget = WidgetService.createWidget(vm.pageId, newWidget);
            console.log(newWidget);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+newWidget._id);
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
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
        }

        init();

        function updateWidget(widget) {
            console.log("widget");
            console.log(widget);
            WidgetService.updateWidget(vm.widgetId, widget);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
        }

    }
})();