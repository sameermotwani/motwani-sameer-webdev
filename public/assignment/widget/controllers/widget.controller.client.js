(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController)
        .controller("FlickrImageSearchController",FlickrImageSearchController);


    function FlickrImageSearchController($sce, $routeParams, $location,FlickrService, WidgetService) {
        var vm = this;
        vm.searchPhotos = searchPhotos;
        vm.getPhotoUrl = getPhotoUrl;
        vm.selectPhoto = selectPhoto;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;
        //console.log(widgetId);
        function init() {
            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function (widget) {
                    vm.widget = widget;
                })
                .error(function () {
                    vm.message = {
                        "type": "ERROR",
                        "content": "Load widget information failed!"
                    };
                });
        }
        init();

        function searchPhotos(searchTerm) {
            FlickrService.searchPhotos(searchTerm)
                .success(function (res) {
                    data = res.replace("jsonFlickrApi(", "");
                    data = data.substring(0, data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                })
                .error(function (err) {
                    vm.error = err.message;
                });
        }

        function getPhotoUrl(photo) {
            var farm = parseInt(photo.farm);
            var server = parseInt(photo.server);
            var id = parseInt(photo.id);
            var secret = photo.secret;
            var url = "https://farm"+farm+".staticflickr.com/"+server+"/"+id+"_"+secret+"_s.jpg";
            photo.url = url;
            return $sce.trustAsResourceUrl(url);
        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            vm.widget.url = url;
            WidgetService
                .updateWidget(vm.widgetId, vm.widget)
                .success(function (status) {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widgetId);
                })
                .error(function () {
                    vm.message = {
                        "type": "ERROR",
                        "content": "Update widget failed!"
                    };
                });
        }
    }



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
                .success(function (widgets) {
                    console.log("hree");
                    console.log(widgets);
                    for (i=0; i<widgets.length-1;i++)
                    {
                        if (widgets[i].priority>widgets[i+1].priority)
                        {
                            temp=widgets[i];
                            widgets[i] = widgets[i+1];
                            widgets[i+1] = temp;
                        }
                    }

                    vm.widgets = widgets;
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
            console.log(newWidget.widgetType);
            console.log(newWidget);
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (response) {
                    var newWidget = response;
                    if(newWidget){
                        console.log("Yes");
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
        vm.searchFromFlickr = searchFromFlickr;

        function init() {
            console.log("in init");
            console.log(vm.widgetId);
            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function (response) {
                    vm.widget = response;
                });
        }

        init();

        function searchFromFlickr() {
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + vm.widgetId + "/flickr");
        }

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