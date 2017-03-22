/**
 * Created by Dhara on 6/7/2016.
 */
module.exports = function () {

    var mongoose = require('mongoose');
    var PageSchema = require("../page/page.schema.server.js")(mongoose);
    
    var WebsiteSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.ObjectId, ref:"User"},
        name: {type: String, required: true},
        description: String,
        pages: [{type: mongoose.Schema.Types.ObjectId, ref: 'assignment.page'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "assignment.website"});
    
    return WebsiteSchema;
};