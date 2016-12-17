(function () {
    angular
        .module("WebMessenger")
        .factory("AbstractService", AbstractService);

    function AbstractService($http) {
        var api = {
            'getImageFromSystem': getImageFromSystem
        };

        return api;

        function getImageFromSystem(imgType, imgId) {
            var url = "/rest/abstract/" + imgType + "?" + "imgId=" + imgId;
            return $http.get(url);
        }
    }
})();