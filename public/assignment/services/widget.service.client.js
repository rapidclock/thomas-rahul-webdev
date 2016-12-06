/**
 * Created by RT on 11/10/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    function WidgetService($http) {
        var api = {
            'createWidget': createWidget,
            'findWidgetsByPageId': findWidgetsByPageId,
            'findWidgetById': findWidgetById,
            'updateWidget': updateWidget,
            'deleteWidget': deleteWidget,
            'deleteWidgetsByPage': deleteWidgetsByPage,
            'uploadImage' : uploadImage,
            'sortWidget' : sortWidget
        };
        return api;


        // Standard API.

        function createWidget(pageId, widget) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.post(url, widget);
        }

        function findWidgetsByPageId(pageId) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.get(url);
        }

        function findWidgetById(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.get(url);
        }

        function updateWidget(widgetId, widget) {
            var url = "/api/widget/" + widgetId;
            return $http.put(url, widget);
        }

        function deleteWidget(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.delete(url);
        }

        function deleteWidgetsByPage(pageId) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.delete(url);
        }

        function uploadImage(formData) {
            var url = "/api/upload";
            var extras = {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            };
            return $http.post(url, formData, extras);
        }
        
        function sortWidget(pid, start, end) {
            var url = "/api/page/" + pid + "/widget?"+ "start=" + start + "&end=" + end;
            return $http.put(url);
        }
    }
})();