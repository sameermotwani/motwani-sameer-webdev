module.exports = function (app) {

    // var mongoose = require("mongoose");
    // var connectionString = 'mongodb://127.0.0.1:27017/webdev';
    //
    // if(process.env.MLAB_USERNAME) {
    //     connectionString = process.env.MLAB_USERNAME + ":" +
    //         process.env.MLAB_PASSWORD + "@" +
    //         process.env.MLAB_HOST + ':' +
    //         process.env.MLAB_PORT + '/' +
    //         process.env.MLAB_APP_NAME;
    //         mongoose.connect(connectionString);
    // }
    // else {
    //     // connect to local database
    //     mongoose.createConnection(connectionString);
    // }

    var models = require("./models/models.server.js")();

    require("./services/user.service.server.js")(app, models);
    require("./services/website.service.server.js")(app, models);
    require("./services/page.service.server.js")(app, models);
    require("./services/widget.service.server.js")(app, models);
};

