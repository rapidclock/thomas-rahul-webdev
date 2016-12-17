(function () {
    angular
        .module("WebMessenger")
        .service("MapService", MapService);

    function MapService($http) {
        var api = {
            'getGeoLocation' : getGeoLocation
        };

        return api;

        function getGeoLocation(){
            var url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCU0jJNoYlh2rIEjnO-2EcJbtWf83tZSuE";
            return $http.post(url);
        }
    }
})();