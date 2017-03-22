/**
 * Created by Dhara on 6/7/2016.
 */
module.exports = function () {
    
    var mongoose = require('mongoose');
    
    var WidgetSchema = mongoose.Schema({
        _page: {type: mongoose.Schema.ObjectId, ref:"Page"},
        widgetType: {
            type: String,
            enum: ['HEADER', 'IMAGE', 'YOUTUBE', 'HTML', 'TEXT'],
            required: true
        },
        priority: Number,
        name: String,
        text: String,
        placeholder: String,
        description: String,
        url: String,
        trust_url: String,
        width: String,
        height: String,
        rows: Number,
        size: Number,
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "assignment.widget"});
    
    return WidgetSchema;
};