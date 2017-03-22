module.exports = function(app, models){

    var pageModel = models.pageModel;
    var websiteModel = models.websiteModel;

    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);


    function createPage(req, res) {
        var newPage = req.body;
        var websiteId = req.params.websiteId;
        pageModel
            .createPage(websiteId, newPage)
            .then(
                function (page) {
                    return websiteModel
                        .addPageForWebsite(websiteId, page);
                }
            )
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    console.log(err);
                    res.sendStatus(500).send(err);
                }
            );
    }


    function findAllPagesForWebsite(req, res){
        var websiteId = req.params.websiteId;
        pageModel
            .findAllPagesForWebsite(websiteId)
            .then(function (pages) {
                res.json(pages);
            }, function(err){
                res.status(400).send("Not page found");
            });

    }

    function findPageById(req, res){
        var pageId = req.params.pageId;
        pageModel
            .findPageById(pageId)
            .then(function (page) {
                res.json(page);
            }, function (err) {
                res.status(404).send(err);
            });
    }

    function updatePage(req, res){
        var pageId = req.params.pageId;
        var page = req.body;

        pageModel
            .updatePage(pageId, page)
            .then(function (response) {
                res.send(200);
            }, function(err) {
                res.status(400).send("Cannot update the page");
            });
    }

    function deletePage(req, res){
        var pageId = req.params.pageId;
        pageModel
            .deletePage(pageId)
            .then(function (response) {
                res.send(200);
            }, function (err) {
                res.status(400).send("Cannot delete Page");
            });

    }
};