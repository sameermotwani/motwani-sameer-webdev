
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
            var key = "bc3540e8359431d7e3f6e2907c9f8443";
            var secret = "8adde937c1102fd4";
            var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search" +
                "&format=json&api_key=API_KEY&text=TEXT";
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();