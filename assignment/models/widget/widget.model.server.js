/**
 * Created by Dhara on 6/7/2016.
 */
module.exports = function () {
    
    var mongoose = require('mongoose');
    var WidgetSchema = require('./widget.schema.server.js')();
    var Widget = mongoose.model('Widget', WidgetSchema);
    
    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget
    };
    return api;

    // Creates a new widget instance for user whose _id is pageId
    function createWidget(pageId, widget) {
        widget._page = pageId;
        return Widget
            .find({_page: pageId})
            .then(
                function (widgets) {
                    var priority = widgets.length;
                    widget.priority = priority;
                    return Widget.create(widget);
                });
    }

    // Retrieves all widget instances for user whose  _id is pageId
    function findAllWidgetsForPage(pageId) {
        return Widget.find({_page: pageId});
    }

    // Retrieves single widget instance whose _id is widgetId
    function findWidgetById(widgetId) {
        return Widget.findById({_id: widgetId});
    }

    // Updates widget instance whose _id is widgetId
    function updateWidget(widgetId, widget) {
        console.log("update");
        console.log(widget);
        if (widget.widgetType == "HEADER") {
            return Widget
                .update({_id: widgetId}, {
                    $set: {
                        name: widget.name,
                        text: widget.text,
                        size: widget.size
                    }
                });
        } else if (widget.widgetType == "IMAGE") {
            return Widget
                .update({_id: widgetId}, {
                    $set: {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        width: widget.width,
                        fileName: widget.fileName
                    }
                });
        } else if (widget.widgetType == "YOUTUBE") {
            return Widget
                .update({_id: widgetId}, {
                    $set: {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        trust_url: widget.trust_url,
                        width: widget.width
                    }
                });
        } else if (widget.widgetType == "TEXT") {
            console.log("In Text");
            return Widget
                .update({_id: widgetId}, {
                    $set: {
                        name: widget.name,
                        text: widget.text,
                        rows: widget.rows,
                        placeholder: widget.placeholder,
                        formatted: widget.formatted
                    }
                });
        } else {
            return Widget
                .update({_id: widgetId}, {
                    $set: {
                        name: widget.name,
                        text: widget.text
                    }
                });
        }
    }

    // Removes widget instance whose _id is widgetId
    function deleteWidget(widgetId) {
        return Widget.remove({_id: widgetId});
    }

    //    Modifies the order of widget at position start into final position end in page whose _id is pageId
    function reorderWidget(pageId, start, end) {
        var start = parseInt(start);
        var end = parseInt(end);
        return Widget
            .find({_page: pageId}, function (err, widgets) {
                if (start < end) {
                    moveUpWidget(widgets, start, end);
                } else if (start > end) {
                    moveDownWidget(widgets, start, end);
                }
            });
    }

    function moveUpWidget(widgets, i, j) {
        for (var w in widgets) {
            if (widgets[w].priority > i && widgets[w].priority <= j) {
                widgets[w].priority -= 1;
                widgets[w].save();
            }
            else if (widgets[w].priority == i) {
                widgets[w].priority = parseInt(j);
                widgets[w].save();
            }
        }
    }

    function moveDownWidget(widgets, i, j) {
        for (var w in widgets) {
            if (widgets[w].priority < i && widgets[w].priority >= j) {
                widgets[w].priority += 1;
                widgets[w].save();
            }
            else if (widgets[w].priority == i) {
                widgets[w].priority = parseInt(j);
                widgets[w].save();
            }
        }
    }


};