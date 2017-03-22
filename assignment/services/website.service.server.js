module.exports = function(app,models) {

    var websiteModel = models.websiteModel;
    var userModel=models.userModel;



    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function createWebsite(req, res) {
        var userId = req.params.userId;
        var newWebsite = req.body;
        websiteModel
            .createWebsite(userId, newWebsite)
            .then(
                function (website) {
                    return userModel
                        .addWebsiteForUser(userId, website);
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

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        console.log("In service server find");
        console.log(userId)
        websiteModel
            .findAllWebsitesForUser(userId)
            .then(
                function(existingWebsites) {
                    console.log("Existing");
                    console.log(existingWebsites);
                    res.json(existingWebsites);
                },
                function(error) {
                    res.statusCode(404).send(error);
                }
            );
    }

    function findWebsiteById(req,res) {
        var websiteId = req.params.websiteId;

        websiteModel
            .findWebsiteById(websiteId)
            .then(
                function(website) {
                    res.json(website);
                },
                function(error) {
                    res.statusCode(404).send(error);
                }
            );
    }

    function updateWebsite(req,res) {
        var website = req.body;
        console.log(website)
        var websiteId = req.params.websiteId;
        console.log(websiteId)

        websiteModel
            .updateWebsite(websiteId, website)
            .then(
                function(stats) {
                    res.send(200);
                },
                function(error) {
                    res.statusCode(404).send(error);
                }
            );
    }

    // function deleteWebsite(req,res) {
    //     var websiteId = req.params.websiteId;
    //
    //     websiteModel
    //         .findWebsiteById(websiteId)
    //         .then(
    //             function(existingWebsite){
    //                 if (existingWebsite !== null) {
    //                     websiteModel
    //                         .deleteWebsite(websiteId);
    //                 }
    //                 else {
    //                     res.status(500).send("Website not found")
    //                 }},
    //             function (error) {
    //                 res.sendStatus(400).send(error);
    //             });
    // }
    function deleteWebsite(req, res){
        var websiteId = req.params.websiteId;
        websiteModel
            .deleteWebsite(websiteId)
            .then(function (response) {
                res.send(200)
            }, function(err){
                res.status(400).send("Cannot delete Website");
            });

    }
};