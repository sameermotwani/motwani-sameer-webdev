module.exports = function () {

    var mongoose = require('mongoose');
    var q = require('q');
    var UserSchema = require('./user.schema.server.js')();
        var User = mongoose.model('User', UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        deleteUser: deleteUser,
        addWebsiteForUser: addWebsiteForUser,
        //deleteWebsiteForUser:deleteWebsiteForUser
    };
    return api;

    // Creates a new user instance
    function createUser(user) {
        return User.create(user);
    }

    // function deleteWebsiteForUser(userId, websiteId) {
    //     console.log(userId);
    //     return User
    //         .findById(userId, function (err, user) {
    //             console.log("HERE");
    //             console.log(user.websites);
    //             var index = user.websites.indexOf(websiteId);
    //             user.websites.splice(index, 1);
    //             user.save();
    //         });
    // }

    // Retrieves a user instance whose _id is equal to parameter userId
    function findUserById(userId) {
        return User.findById({_id: userId});
    }

    // Retrieves a user instance whose username and password are equal to parameters userId and password
    function findUserByCredentials(username, password) {
      return User.findOne({username: username, password: password});
    }

    // Retrieves a user instance whose username is equal to parameter username
    // function findUserByUsername(username){
    //     return User.findOne({username: username});
    // }

    function addWebsiteForUser(userId, website) {
        return User
            .findById(userId, function (err, user) {
                user.websites.push(website);
                user.save();
            });
    }



    function findUserByUsername(userName){
        var deferred = q.defer();
        User.find(
            {username: userName},
            function(err,doc){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(doc);
                }
            }
        );

        return deferred.promise;
    }

    // Updates user instance whose _id is equal to parameter userId
    function updateUser(userId, user) {
        return User
            .update({_id: userId}, {
                $set: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    websites: user.websites
                }
            });
    }

    // Removes user instance whose _id is equal to parameter userId
    function deleteUser(userId) {
        return User.remove({_id: userId});
    }
};