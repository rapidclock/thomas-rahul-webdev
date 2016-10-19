/**
 * Created by RT on 11/10/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    function WidgetService() {
        var widgets = [
            {_id: "123", widgetType: "HEADER", pageId: "321", size: 2, text: "GIZMODO"},
            {_id: "234", widgetType: "HEADER", pageId: "100", size: 4, text: "Lorem ipsum"},
            {_id: "345", widgetType: "IMAGE", pageId: "321", width: "100%", url: "http://lorempixel.com/400/200/"},
            {_id: "456", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"},
            {_id: "567", widgetType: "HEADER", pageId: "321", size: 4, text: "Lorem ipsum"},
            {_id: "678", widgetType: "YOUTUBE", pageId: "321", width: "100%", url: "https://www.youtube.com/embed/8Pa9x9fZBtY"},
            {_id: "789", widgetType: "HTML", pageId: "100", text: "<p>Lorem ipsum</p>"}
        ];

        var createWidgetMap = {
            'HEADER': createHeaderWidget,
            'IMAGE': createImageWidget,
            'YOUTUBE': createYouTubeWidget,
            'HTML': createHTMLWidget,
            'LINK': createLinkWidget,
            'TEXTINPUT': createTextInputWidget,
            'LABEL': createLabelWidget,
            'BUTTON': createButtonWidget,
            'REPEATER': createRepeaterWidget,
            'DATATABLE': createDataTableWidget
        };

        var api = {
            'createWidget': createWidget,
            'findWidgetsByPageId': findWidgetsByPageId,
            'findWidgetById': findWidgetById,
            'updateWidget': updateWidget,
            'deleteWidget': deleteWidget,
            'deleteWidgetsByPage': deleteWidgetsByPage
        };
        return api;

        function getNextId() {
            function getMaxId(maxId, currentId) {
                var current = parseInt(currentId._id);
                if (maxId > current) {
                    return maxId;
                } else {
                    return current + 1;
                }
            }
            return pages.reduce(getMaxId, 0).toString();
        }

        function createHeaderWidget(widgetId, pageId, widget) {
            return {
                _id: widgetId,
                widgetType: 'HEADER',
                pageId: pageId,
                size: widget.size,
                text: widget.text
            };
        }

        function createLabelWidget(widgetId, pageId, widget) {
        }

        function createHTMLWidget(widgetId, pageId, widget) {
            return {
                _id: widgetId,
                widgetType: 'HTML',
                pageId: pageId,
                text: widget.text
            };
        }

        function createTextInputWidget(widgetId, pageId, widget) {

        }

        function createLinkWidget(widgetId, pageId, widget) {

        }

        function createButtonWidget(widgetId, pageId, widget) {

        }

        function createImageWidget(widgetId, pageId, widget) {
            return {
                _id: widgetId,
                widgetType: 'IMAGE',
                pageId: pageId,
                width: widget.width,
                url: widget.url
            };

        }

        function createYouTubeWidget(widgetId, pageId, widget) {
            return {
                _id: widgetId,
                widgetType: 'YOUTUBE',
                pageId: pageId,
                width: widget.width,
                url: widget.url
            };

        }

        function createDataTableWidget(widgetId, pageId, widget) {

        }

        function createRepeaterWidget(widgetId, pageId, widget) {

        }


        /*
         * Standard CRUD
         */
        function createWidget(pageId, widget) {
            var newWidgetId = getNextId();
            return createWidgetMap[widget.widgetType](newWidgetId, pageId, widget);
        }

        function findWidgetsByPageId(pageId) {
            results = [];
            function filterByPageId(widget) {
                return widget.pageId === pageId;
            }

            results = widgets.filter(filterByPageId);
            return results;
        }

        function findWidgetById(widgetId) {
            for (wid in widgets) {
                var widget = widgets[wid];
                if (widget._id === widgetId) {
                    return widget;
                }
            }
            return null;
        }

        function updateWidget(widgetId, widget) {
            var oldWidget = findWidgetById(widgetId);
            var index = widgets.indexOf(oldWidget);
            if (oldWidget.widgetType != widget.widgetType) {
                return;
            }
            Object.keys(widget).forEach(function (property) {
                if (property === '_id' || property === 'widgetType' || property === 'pageId') {
                    return;
                }
                if (oldWidget.hasOwnProperty(property)) {
                    oldWidget[property] = widget[property];
                }
            });
        }

        function deleteWidget(widgetId) {
            var oldWidget = findWidgetById(widgetId);
            var index = widgets.indexOf(oldWidget);
            widgets.splice(index, 1);
        }

        function deleteWidgetsByPage(pageId) {
            for (wid in widgets) {
                widget = widgets[wid];
                if (widget.pageId === pageId) {
                    deleteWidget(widget._id);
                }
            }
        }
    }
})();