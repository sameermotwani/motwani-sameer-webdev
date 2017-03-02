module.exports = function (app) {
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post("/api/page/:pageId/widget",createWidget);
    app.get("/api/page/:pageId/widget",findAllWidgetsForPage);
    app.get("/api/widget/:widgetId",findWidgetById);
    app.put("/api/widget/:widgetId",updateWidget);
    app.delete("/api/widget/:widgetId",deleteWidget);
    app.put("/api/page/:pageId/widget", updateWidgetOrder);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    var widgets = [
        {"_id": 123, "widgetType": "HEADER", "pageId": "321", "size": "2", "text": "GIZMODO"},
        {"_id": 234, "widgetType": "HEADER", "pageId": "321", "size": "4", "text": "Lorem ipsum"},
        {
            "_id": 345, "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"
        },
        {"_id": 567, "widgetType": "HEADER", "pageId": "321", "size": "4", "text": "Lorem ipsum"},
        {
            "_id": 678, "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://www.youtube.com/embed/AM2Ivdi9c4E"
        }
    ];





        function createWidget(req, res){
        var pageId = req.params.pageId;
        var widget = req.body;
        var wgid = (parseInt(widgets[widgets.length -1]._id) + 1).toString();
        var priority = widgets.length;

        // var newWidget={_id: wgid,
        //             widgetType: widget.widgetType,
        //             pageId: pageId,
        //             size: widget.size,
        //             text: widget.text};


        var newWidget = {};
        switch (widget.widgetType) {
            case "HEADER":
                newWidget = {
                    _id: wgid,
                    widgetType: widget.widgetType,
                    pageId: pageId,
                    size: widget.size,
                    text: widget.text
                };
                break;
            case "HTML":
                newWidget = {
                    _id: wgid,
                    widgetType: widget.widgetType,
                    pageId: pageId,
                    text: widget.text
                };
                break;
            case "IMAGE":
                newWidget = {
                    _id: wgid,
                    widgetType: widget.widgetType,
                    pageId: pageId,
                    width: widget.width,
                    url: widget.url
                };
                break;
            case "YOUTUBE":
                newWidget = {
                    _id: wgid,
                    widgetType: widget.widgetType,
                    pageId: pageId,
                    width: widget.width,
                    url: widget.url,
                    trust_url:widget.trust_url
                };
                break;
        }
        widgets.push(newWidget);
        res.json(newWidget);
    }
    function findAllWidgetsForPage(req, res){
        var pageId = req.params.pageId;
        var widgetsList = widgets.filter(function(widget){
            return widget.pageId == pageId;
        });
        res.json(widgetsList);
    }
    function findWidgetById(req, res){
        var widgetId = req.params.widgetId;
        var widget = widgets.find(function (widget) {
            return widget._id == widgetId;
        })
        res.json(widget);
    }
    function updateWidget(req, res){
        var wgid = req.params.widgetId;
        var updatedWidget = req.body;
        for(var i in widgets) {
            var widget = widgets[i];
            if( widget._id == wgid) {
                widgets[i] = updatedWidget;
                res.json(widget);
                return;
            }
        }
    }

    function deleteWidget(req, res){
        var wgid = req.params.widgetId;
        for(var i in widgets) {
            var widget = widgets[i];
            if( widget._id == wgid ) {
                widgets.splice(i,1);
                res.sendStatus(200);
                return;
            }
        }
    }

    function updateWidgetOrder(req,res){
        var startIndex = req.query['startIndex'];
        var endIndex = req.query['endIndex'];
        var pageId = req.params['pageId'];
        var widgetArray = widgets.filter(function(widget){
            return widget.pageId == pageId;
        });
        // console.log("widgetArray");
        // console.log(widgetArray);
        // console.log("widgetArray");
        if(widgetArray == null)
            widgetArray = [];
            if(widgetArray.length> 0){
                // for(var i in widgets)
                    for (var i = widgets.length - 1; i >= 0; i--)
                    {
                    var widget = widgets[i];
                    for (var x in widgetArray)
                    {
                        // console.log("$$$$$");
                        // console.log(widgetArray[x]._id+"++"+widget._id);
                        // console.log("$$$$$");
                        if (widget._id == widgetArray[x]._id) {
                            // console.log("yes");
                            widgets.splice(i, 1);

                        }
                    }
                }
            var widget = widgetArray[startIndex];
            widgetArray.splice(startIndex,1);
            widgetArray.splice(endIndex,0,widget);
            // console.log("tetststs");
            //     console.log(widgets);
            //     console.log("tetststs");
                // widgets.concat(widgetArray);
                len=widgets.length;
                for(x in widgetArray)
                {
                    widgets[len]=widgetArray[x];
                    len++;
                }
                // console.log("*********");
            res.json(widgets);
            return;
        }
    }
    function uploadImage(req, res) {
        console.log("Yes heere");
        var widgetId      = req.body.widgetId;
        console.log(widgetId);
        var width         = req.body.width;
        console.log(width);
        var myFile        = req.file;

        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var widget = widgets.find(function (widget) {
            return widget._id == widgetId;
        })
        widget.width=width;
        widget.url = '/uploads/'+filename;
        res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget");

    }
}
