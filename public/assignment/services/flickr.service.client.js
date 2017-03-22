
(function () {
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);
    
    function FlickrService($http) {
        var api = {
            // "getSearchUrl" : getSearchUrl,
            "searchPhotos" : searchPhotos
        };

        return api;
/*
        function getSearchUrl(searchTerm) {
            return $http.get("/api/search-flickr?searchTerm="+searchTerm);
        }
*/
        function searchPhotos(searchTerm){
            var key = "ccda8debdd43c8473b2152e01fd06bc4";
            var secret = "beaf0edb8ea05089";
            var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search" +
                "&format=json&api_key=API_KEY&text=TEXT";
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();