(function () {
    angular
        .module("WebMessenger")
        .directive('bgImg', BgImg);

    function BgImg() {
        return function (scope, element, attrs) {
            var url = attrs.bgImg;
            element.css({
                'background-image': 'url(' + url + ')',
                'background-size': 'cover'
            });

            // var url = '/json/FindImage?id=1';
            // $http.get(url).success(function(result) {
            //     $scope.image = result.Image;
            // }
        };
    }
})();