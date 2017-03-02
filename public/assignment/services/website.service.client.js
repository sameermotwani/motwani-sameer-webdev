(function () {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService($http) {

        var api = {
            "createWebsite": createWebsite,
            "findWebsitesByUser": findWebsitesByUser,
            "findWebsitesById": findWebsitesById,
            "updateWebsite": updateWebsite,
            "deleteWebsite": deleteWebsite
        };
        return api;

        function createWebsite(userId, website) {
            return $http.post("/api/user/"+userId+"/website", website);
        }

        function findWebsitesByUser(uid) {
            return $http.get("/api/user/" + uid + "/website");
        }

        function findWebsitesById(wid) {
                return $http.get("/api/website/" + wid);
        }

        function updateWebsite(wid, updatedWebsite) {
            console.log(updatedWebsite);
            return $http.put("/api/website/" + wid, updatedWebsite);
        }

        function deleteWebsite(wid) {
            return $http.delete("/api/website/" + wid);
        }


        // function findWebsitesByUser(userId) {
        //     userWebsites = [];
        //     for (var i = 0; i < websites.length; i++) {
        //         if (websites[i].developerId == userId) {
        //             userWebsites.push(websites[i])
        //         }
        //     }
        //     return userWebsites;
        // }
        //
        // function findWebsiteById(websiteId) {
        //     var left = 0;
        //     var right = websites.length;
        //     while (left <= right) {
        //         var mid = parseInt((left + right) / 2);
        //         if (websites[mid]._id == websiteId) {
        //             return websites[mid];
        //         } else if (websites[mid]._id > websiteId) {
        //             right = mid - 1;
        //         } else {
        //             left = mid + 1;
        //         }
        //     }
        //     return null;
        // }
        //
        // function updateWebsite(websiteId, website) {
        //     for (var i = 0; i < websites.length; i++) {
        //         if (websites[i]._id == websiteId) {
        //             websites[i].name = website.name;
        //             websites[i].description = website.description;
        //         }
        //     }
        // }
        //
        // function deleteWebsite(websiteId) {
        //     for (var i = 0; i < websites.length; i++) {
        //         if (websites[i]._id == websiteId) {
        //             websites.splice(i, 1);
        //         }
        //     }
        // }
    }
})();