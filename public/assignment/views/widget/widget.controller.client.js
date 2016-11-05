(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("CreateWidgetController", CreateWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        init();

        function init() {
            var promise = WidgetService.findWidgetsByPageId(vm.pid);
            promise
                .success(function (widgets) {
                    vm.widgets = widgets;
                })
                .error(function () {
                    console.log("Error Retrieving Widgets Data");
                });
        }
    }

    function NewWidgetController($routeParams, $timeout, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        init();
        vm.futureFeature = futureFeature;
        vm.featureMissingAlert = null;

        function init() {
            var promise = WidgetService.findWidgetsByPageId(vm.pid);
            promise
                .success(function (widgets) {
                    vm.widgets = widgets;
                })
                .error(function () {
                    console.log("Error Retrieving Widgets Data");
                });
        }

        function futureFeature() {
            vm.featureMissingAlert = "Coming Soon. Feature Not Implemented Yet. Stay Tuned...";
            $timeout(function () {
                vm.featureMissingAlert = null;
            }, 5000);
        }
    }

    function CreateWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.widgetType = $routeParams.wtype;
        vm.createWidget = createWidget;
        vm.createError = "";

        function createWidget() {
            if (vm.widgetType === 'HEADER') {
                if (vm.widgetText === null || vm.widgetText === undefined) {
                    vm.createError = "Text is required for Header.";
                    return;
                }
            }

            if (vm.widgetType === 'IMAGE') {
                if (vm.widgetUrl === null || vm.widgetUrl === undefined) {
                    vm.createError = "Url is required for Image.";
                    return;
                }
            }

            if (vm.widgetType === 'YOUTUBE') {
                if (vm.widgetUrl === null || vm.widgetUrl === undefined) {
                    vm.createError = "Url is required for Youtube.";
                    return;
                }
                if(!validateUrl(vm.widgetUrl)){
                    vm.createError = "Url is Invalid.";
                    return;
                }
            }

            if(vm.widgetWidth !== null || vm.widgetWidth !== undefined || vm.widgetWidth !== ""){
                if (parseInt(vm.widgetWidth) > 100 || parseInt(vm.widgetWidth) < 0){
                    vm.createError = "Width should be between 0 and 100.";
                    return;
                } else {
                    vm.widgetWidth = 100;
                }
            }

            var newWidget = {
                name: vm.widgetName,
                text: vm.widgetText,
                widgetType: vm.widgetType,
                size: vm.widgetSize,
                width: vm.widgetWidth,
                url: vm.widgetUrl
            };
            var promise = WidgetService.createWidget(vm.pid, newWidget);
            promise
                .success(function(){

                })
                .error(function(){
                    console.log("Error Creating the " + vm.widgetType + " widget.")
                });
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
        }

        function validateUrl(url){
            var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            if(url.match(p)){
                return url.match(p)[1];
            }
            return false;
        }
    }

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;
        init();
        vm.editWidget = editWidget;
        vm.deleteWidget = deleteWidget;
        vm.errorMessage = "";

        function init(){
            var promise = WidgetService.findWidgetById(vm.wgid);
            promise
                .success(function (widget) {
                    vm.widget = widget;
                    if (vm.widget.widgetType === 'HEADER') {
                        vm.widgetName = vm.widget.name;
                        vm.widgetText = vm.widget.text;
                        vm.widgetSize = vm.widget.size;
                    } else if (vm.widget.widgetType === 'IMAGE') {
                        vm.widgetName = vm.widget.name;
                        vm.widgetText = vm.widget.text;
                        vm.widgetUrl = vm.widget.url;
                        vm.widgetWidth = vm.widget.width;
                    } else if (vm.widget.widgetType === 'YOUTUBE') {
                        vm.widgetName = vm.widget.name;
                        vm.widgetText = vm.widget.text;
                        vm.widgetUrl = vm.widget.url;
                        vm.widgetWidth = vm.widget.width;
                    }
                })
                .error(function () {
                    console.log("Error retrieving data");
                });
        }



        function editWidget() {
            // refreshFields();
            vm.errorMessage = "";
            if(!validateWidth()){
                vm.errorMessage = "Width should be between 0 and 100.";
                return;
            }
            if(vm.widget.widgetType === "YOUTUBE"){
                if(!validateUrl(vm.widgetUrl)){
                    vm.errorMessage += " URL not an embed link!";
                    return;
                }
            }
            var latestData = {
                name: vm.widgetName,
                text: vm.widgetText,
                widgetType: vm.widget.widgetType,
                size: vm.widgetSize,
                width: vm.widgetWidth,
                url: vm.widgetUrl
            };
            WidgetService.updateWidget(vm.wgid, latestData);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
        }

        function validateUrl(url){
            var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            if(url.match(p)){
                return url.match(p)[1];
            }
            return false;
        }


        function validateWidth(){
            if(vm.widgetWidth !== null || vm.widgetWidth !== undefined || vm.widgetWidth !== ""){
                if (parseInt(vm.widgetWidth) > 100 || parseInt(vm.widgetWidth) < 0){
                    return false;
                }
            }
            vm.widgetWidth = 100;
            return true;
        }

        function deleteWidget() {
            var promise = WidgetService.deleteWidget(vm.wgid);
            promise
                .success(function(){
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
                })
                .error(function(){
                    console.log("Error Deleting Widget.");
                });
        }

    }
})();