
module.exports = function () {
    
    var mongoose = require('mongoose');
    var PageSchema = require('./page.schema.server.js')();
    var Page = mongoose.model('Page', PageSchema);
    
    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        addWidgetForPage:addWidgetForPage

    };
    return api;

    // Creates a new page instance for user whose _id is websiteId
    function createPage(websiteId, page) {
        page._website = websiteId;
        return Page.create(page);
    }


    function addWidgetForPage(pageId, newWidget) {
        return Page
            .findById(userId, function (err, page) {
                page.widgets.push(newWidget);
                page.save();
            });
    }

    // Retrieves all page instances for user whose  _id is websiteId
    function findAllPagesForWebsite(websiteId) {
        return Page.find({_website: websiteId});
    }

    // Retrieves single page instance whose _id is pageId
    function findPageById(pageId) {
        return Page.findById({_id: pageId});
    }

    // Updates page instance whose _id is pageId
    function updatePage(pageId, page) {
        return Page
            .update({_id: pageId}, {
                $set: {
                    name: page.name,
                    title: page.title,
                    widgets: page.widgets
                }
            });
    }

    // Removes page instance whose _id is pageId
    function deletePage(pageId) {
        return Page.remove({_id: pageId});
    }
};