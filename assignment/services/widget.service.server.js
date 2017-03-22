module.exports = function (app,models) {
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var widgetModel = models.widgetModel;
    var pageModel = models.pageModel;

    app.post("/api/page/:pageId/widget",createWidget);
    app.get("/api/page/:pageId/widget",findAllWidgetsForPage);
    app.get("/api/widget/:widgetId",findWidgetById);
    app.put("/api/widget/:widgetId",updateWidget);
    app.delete("/api/widget/:widgetId",deleteWidget);
    app.put("/api/page/:pageId/widget", updateWidgetOrder);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);


        function createWidget(req, res){
        var pageId = req.params.pageId;
        var widget = req.body;
       // var wgid = (parseInt(widgets[widgets.length -1]._id) + 1).toString();
        //var priority = widgets.length;
        var newWidget = {};
        console.log("HREE");
        console.log(widget);
        switch (widget.widgetType) {
            case "HEADER":
                newWidget = {
                   // _id: wgid,
                    widgetType: widget.widgetType,
                    pageId: pageId,
                    size: widget.size,
                    text: widget.text
                };
                break;
            case "HTML":
                newWidget = {
                    //_id: wgid,
                    widgetType: widget.widgetType,
                    pageId: pageId,
                    text: widget.text
                };
                break;
            case "IMAGE":
                newWidget = {
                    //_id: wgid,
                    widgetType: widget.widgetType,
                    pageId: pageId,
                    width: widget.width,
                    url: widget.url
                };
                break;
            case "TEXT":
                console.log("In TEXR");
                console.log(widget);
                newWidget = {
                    //_id: wgid,
                    widgetType: widget.widgetType,
                    pageId: pageId,
                    width: widget.name,
                    text: widget.text,
                    rows: widget.rows,
                    placeholder: widget.placeholder,
                    formatted: widget.formatted
                };
                break;
            case "YOUTUBE":
                console.log(widget.url);
                console.log(widget.trust_url);
                console.log("Yes");
                newWidget = {
                    //_id: wgid,
                    widgetType: widget.widgetType,
                    pageId: pageId,
                    width: widget.width,
                    url: widget.url,
                    trust_url:widget.trust_url
                };
                break;
        }
            widgetModel
                .createWidget(pageId, newWidget)
                .then(function(newWidget) {
                        res.json(newWidget);
                        console.log("New Widget");
                        console.log(newWidget);
                    },
                    function(error) {
                        res.statusCode(404).send(error);
                    }
                )
    }
    function findAllWidgetsForPage(req, res){
        var pageId = req.params.pageId;
         widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function (widgets) {
                    res.json(widgets);
                },
                function (err) {
                    console.log(err);
                    res.sendStatus(500).send(err);
                }
            );

    }

    function findWidgetById(req, res){
        var widgetId = req.params.widgetId;
        widgetModel
            .findWidgetById(widgetId)
            .then(
                function (widget) {
                    res.json(widget);
                },
                function (err) {
                    console.log(err);
                    res.sendStatus(500).send(err);
                }
            );
    }


    function updateWidget(req, res){
        var widgetId = req.params.widgetId;
        var newWidget = req.body;
        console.log(newWidget);
        console.log("yahan");
        widgetModel
            .updateWidget(widgetId, newWidget)
            .then(
                function (widget) {
                    res.sendStatus(200);
                },
                function (err) {
                    console.log(err);
                    res.sendStatus(500).send(err);
                }
            );
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;

        widgetModel
            .deleteWidget(widgetId)
            .then(function (response) {
                res.send(200);
            }, function(err){
                res.status(400).send("Not able to delete widget")
            });
    }


    function updateWidgetOrder(req,res) {
        var startIndex = req.query['startIndex'];
        var endIndex = req.query['endIndex'];
        var pageId = req.params['pageId'];

        widgetModel.reorderWidget(pageId, startIndex, endIndex)
            .then(function (widgets) {
                    res.status(200).json(widgets);
                },
                function (err) {
                    res.status(404).send('No widgets for the page: ' + pageId);
                });
    }

    function uploadImage(req, res) {
        console.log("Yes heere");
        var widgetId      = req.body.widgetId;
        console.log(widgetId);
        var width         = req.body.width;
        var name         = req.body.name;
        var text         = req.body.text;
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

        widgetModel
            .findWidgetById(widgetId)
            .then(
                function (widget) {
                    widget.width=width;
                    widget.name=name;
                    widget.text=text;
                    widget.url = '/uploads/'+filename;
                    widget.save();
                    res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget");
                },
                function (err) {
                    console.log(err);
                    res.sendStatus(500).send(err);
                }
            );

    }
}
