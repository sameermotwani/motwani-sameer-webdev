module.exports = function (app,models) {
    app.get("/api/user", findUser);
    app.post("/api/user", createUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    var userModel = models.userModel;
    // var users = [
    //     {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder" ,"email": "alice@fb.edu" },
    //     {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley" ,"email": "bob@fb.edu"  },
    //     {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia" ,"email": "cha@fb.edu" },
    //         {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" ,"email": "jos@fb.edu"}
    // ];

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(userId, newUser)
            .then(
                function (stats) {
                    // console.log(stats);
                    res.send(stats);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function findUserById(req, res) {
        var id = req.params.userId;
        userModel
            .findUserById(id)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.statusCode(404).send(error);
                }
            );
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password) {
            findUserByCredentials(req, res);
        } else if(username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res){
        var username = req.query.username;
        userModel
            .findUserByUsername(username, res)
            .then(
                function (user) {
                    if (user = []) {
                        res.status(500).send("User not found");
                    }
                    else {
                        console.log("yahan");
                        res.json(user);
                    }},
                function(err) {
                    res.status(404).send(err);
                }
            );
    }

    function findUserByCredentials(req, res){
        var username = req.query.username;
        var password = req.query.password;
        userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    if (user !== null) {
                        res.json(user)
                    }
                    else {
                        res.status(500).send("User not found");
                    }},
                function (err) {
                    console.log(err);
                    res.sendStatus(500).send(err);
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        userModel
            .deleteUser(userId)
            .then(
                function (user) {
                    // console.log(user);
                    res.json(user);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function createUser(req, res){
        var user = req.body;
        userModel
            .createUser(user)
            .then(
                function (user) {
                    // console.log(user);
                    res.json(user);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }
}