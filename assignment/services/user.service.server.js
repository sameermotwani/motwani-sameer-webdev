var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require("bcrypt-nodejs");


module.exports = function (app,models) {
    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.post ('/api/register', register);
    app.get ('/api/loggedin', loggedin);
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));

    app.get("/api/user", findUser);
    app.post("/api/user", createUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }


    function logout(req, res) {
        console.log("clicked logout");
        req.logOut();
        res.send(200);
    }


    passport.use(new LocalStrategy(localStrategy));

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID || 107164386498119,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET || "86679fe0745ec0d4015b567256dc8b56",
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL || "http://localhost:3000/auth/facebook/callback"
    };

    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);




    function localStrategy(username, password, done) {
        console.log(password);
        console.log("In Local Strategy");
        //password = bcrypt.hashSync(password);
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    console.log("inside promise");
                    console.log(user);
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    var userModel = models.userModel;

    function facebookStrategy(token, refreshToken, profile, done) {
        console.log("Facebook Login");
        console.log(profile);
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function (facebookUser) {
                    if(facebookUser) {
                        return done(null, facebookUser);
                    } else {
                        facebookUser = {
                            username: profile.displayName.replace(/ /g, ''),
                            facebook: {
                                token: token,
                                id: profile.id,
                                displayName: profile.displayName
                            }
                        };
                        userModel
                            .createUser(facebookUser)
                            .then(
                                function (user) {
                                    done(null, user);
                                },
                                function (error) {
                                    done(error, null);
                                }
                            )
                    }
                },
                function (error) {
                    done(error, null);
                }
            );
    }

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }


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
            .findUserByUsername(username)
            .then(
                function (user) {
                    console.log("user");
                    console.log(user);
                    if (user == [] || user == null) {
                        console.log(user);
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

    // function findUserByUsername(req, res) {
    //     var username = req.query.username;
    //     userModel
    //         .findUserByUsername(username)
    //         .then(
    //             function (user) {
    //                 if (user) {
    //                     res.json(user);
    //                 } else {
    //                     res.sendStatus(500);
    //                 }
    //             }
    //         );
    // }


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

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }
}