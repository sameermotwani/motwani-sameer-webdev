module.exports = function () {
var mongoose = require("mongoose");
    var connectionString = 'mongodb://127.0.0.1:27017/webAppMaker';
     if(process.env.MLAB_USERNAME) {
         connectionString = process.env.MLAB_USERNAME + ":" +
             process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
             process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
	console.log(connectionString);
	mongoose.connect(connectionString);
    }
    console.log(connectionString);


    
    //mongoose.Promise = global.Promise;

   // var options = { promiseLibrary: require('bluebird') };
   // mongoose.connect(connectionString);
    //var Promise = require('bluebird');
    //mongoose.Promise = global.Promise;
   // var options = { promiseLibrary: require('bluebird') };
   // mongoose.createConnection(connectionString, options);

    //var connectionString = 'mongodb://127.0.0.1:27017/webdev';

    // if(process.env.MLAB_USERNAME) {
    //     connectionString = process.env.MLAB_USERNAME + ":" +
    //         process.env.MLAB_PASSWORD + "@" +
    //         process.env.MLAB_HOST + ':' +
    //         process.env.MLAB_PORT + '/' +
    //         process.env.MLAB_APP_NAME;
    // }
    //
    // var mongoose = require("mongoose");
    // var Promise = require('bluebird');
    //
    // var options = { promiseLibrary: require('bluebird') };
    // mongoose.createConnection(connectionString, options);


    var models = {
        userModel: require("./user/user.model.server.js")(),
        websiteModel: require("./website/website.model.server.js")(),
       pageModel: require("./page/page.model.server.js")(),
        widgetModel: require("./widget/widget.model.server.js")()
    };
    return models;
};