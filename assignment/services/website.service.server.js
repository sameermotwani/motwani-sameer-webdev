module.exports = function (app) {

    var websites = [
        {"_id": 123, "name": "Facebook", "developerId": "456", "description": "Lorem"},
        {"_id": 234, "name": "Tweeter", "developerId": "456", "description": "Lorem"},
        {"_id": 456, "name": "Gizmodo", "developerId": "456", "description": "Lorem"},
        {"_id": 567, "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem"},
        {"_id": 678, "name": "Checkers", "developerId": "123", "description": "Lorem"},
        {"_id": 789, "name": "Chess", "developerId": "234", "description": "Lorem"}
    ];

    app.post("/api/user/:userId/website",createWebsite);
    app.get("/api/user/:userId/website",findAllWebsitesForUser);
    app.get("/api/website/:websiteId",findWebsiteById);
    app.put("/api/website/:websiteId",updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function createWebsite(req, res){
        var userId = req.params.userId;
        var newwebsite = req.body;
        var wid = (parseInt(websites[websites.length -1]._id) + 1).toString();
        var newWebsite = {_id: wid,
            name: newwebsite.name,
            developerId: userId,
            description: newwebsite.description};
        websites.push(newWebsite);
        res.json(newWebsite);
    }
    function findAllWebsitesForUser(req, res){
        var userId = req.params.userId;
        var websitesList = websites.filter(function (website) {
            return website.developerId == userId;
        });
        res.json(websitesList);
    }
    function findWebsiteById(req, res){
        var websiteId = req.params.websiteId;
        var website = websites.find(function (websiteObject) {
            return websiteObject._id == websiteId;
        });
        res.json(website);
    }
    function updateWebsite(req, res){
        var websiteId = req.params.websiteId;
        var updatedWebsite = req.body;
        console.log(updatedWebsite);
        for(var i in websites) {
            var website = websites[i];
            if( website._id == websiteId ) {
                websites[i].name = updatedWebsite.name;
                websites[i].description = updatedWebsite.description;
                res.json(website);
                return;
            }

        }
    }
    function deleteWebsite(req, res){
        var websiteId = req.params.websiteId;
        for(var i in websites) {
            var website = websites[i];
            if( website._id == websiteId ) {
                websites.splice(i,1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }
}
