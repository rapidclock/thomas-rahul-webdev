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
        vm.sort = sortWidgets;

        init();

        function sortWidgets(start, end) {
            var promise = WidgetService.sortWidget(vm.pid, start, end);
            promise
                .success(function () {
                    
                })
                .error(function () {
                    
                });
        }

        function init() {
            var promise = WidgetService.findWidgetsByPageId(vm.pid);
            promise
                .success(function (widgets) {
                    var allWidgets = [];

                    for(i=0;i<widgets.length;i++){
                        var promise = WidgetService.findWidgetById(widgets[i]);
                        promise
                            .success(function(widget){
                                if (widget){
                                    allWidgets.push(widget);
                                }
                            })
                            .error(function(error){
                                console.log(error);
                            });
                    }
                    vm.widgets = allWidgets;

                    // vm.widgets = widgets;
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
        // init();
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

    function CreateWidgetController($scope, $routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.widgetType = $routeParams.wtype;
        vm.createWidget = createWidget;
        vm.upload = uploadImg;
        vm.createError = "";

        function uploadImg() {
            var file = vm.myFile;
            var formData = new FormData();
            formData.append('file', file);
            if(vm.formData){
                if(formData == vm.formData){
                    return;
                }
            }
            vm.formData = formData;
            var promise = WidgetService.uploadImage(formData);
            promise
                .success(function (uploadDetails) {
                    if(uploadDetails !== null){
                        updateWidgetData(uploadDetails);
                    }
                })
                .error(function () {
                    console.log("File Upload Failed");
                });
        }

        function updateWidgetData(uploadDetails){
            vm.widgetName = uploadDetails.originalname;
            vm.widgetUrl = "./uploads/" + uploadDetails.filename;
        }

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

            if (vm.widgetType === 'HTML') {
                if(vm.widgetText === null || vm.widgetText === undefined || vm.widgetText === ""){
                    vm.createError = "Text is required for HTML Widgets";
                    return;
                }
            }

            if (vm.widgetType === 'TEXT') {
                // TODO Text creation controller code
                if(vm.widgetName === null || vm.widgetName === undefined || vm.widgetName === ""){
                    vm.createError = "Name is required for HTML Widgets";
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
                widgetType: vm.widgetType
            };
            if(vm.widgetText){
                newWidget.text = vm.widgetText;
            }
            if(vm.widgetSize){
                newWidget.size = vm.widgetSize;
            }
            if(vm.widgetWidth){
                newWidget.width = vm.widgetWidth;
            }
            if(vm.widgetUrl){
                newWidget.url = vm.widgetUrl;
            }
            if(vm.widgetRows){
                newWidget.rows = vm.widgetRows;
            }
            if(vm.widgetPlaceholder){
                newWidget.placeholder = vm.widgetPlaceholder;
            }
            if(vm.widgetFormatted){
                newWidget.formatted = vm.widgetFormatted;
            }
            console.log(newWidget);


            var promise = WidgetService.createWidget(vm.pid, newWidget);
            promise
                .success(function(){
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
                })
                .error(function(){
                    console.log("Error Creating the " + vm.widgetType + " widget.")
                });
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
        vm.upload = uploadImg;
        vm.errorMessage = "";

        function init(){
            var promise = WidgetService.findWidgetById(vm.wgid);
            promise
                .success(function (widget) {
                    vm.widget = widget;
                    console.log(vm.widget);
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
                    } else if (vm.widget.widgetType === 'HTML') {
                        vm.widgetName = vm.widget.name;
                        vm.widgetText = vm.widget.text;
                    } else if (vm.widget.widgetType === 'TEXT') {
                        vm.widgetName = vm.widget.name;
                        vm.widgetText = vm.widget.text;
                        vm.widgetRows = vm.widget.rows;
                        vm.widgetPlaceholder = vm.widget.placeholder;
                        vm.widgetFormatted = vm.widget.formatted;
                    }
                })
                .error(function () {
                    console.log("Error retrieving data");
                });
        }

        function uploadImg() {
            var file = vm.myFile;
            var formData = new FormData();
            formData.append('file', file);
            if(vm.formData){
                if(formData == vm.formData){
                    return;
                }
            }
            vm.formData = formData;
            var promise = WidgetService.uploadImage(formData);
            promise
                .success(function (uploadDetails) {
                    if(uploadDetails !== null){
                        updateWidgetData(uploadDetails);
                    }
                })
                .error(function () {
                    console.log("File Upload Failed");
                });
        }

        function updateWidgetData(uploadDetails){
            vm.widgetName = uploadDetails.originalname;
            vm.widgetUrl = "./uploads/" + uploadDetails.filename;
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
            console.log(vm.widgetName);
            var latestData = {
                name: vm.widgetName,
                text: vm.widgetText,
                widgetType: vm.widget.widgetType
            };
            if(vm.widgetSize){
                latestData.size = vm.widgetSize;
            }
            if(vm.widgetWidth){
                latestData.width = vm.widgetWidth;
            }
            if(vm.widgetUrl){
                latestData.url = vm.widgetUrl;
            }
            if(vm.widgetRows){
                latestData.rows = vm.widgetRows;
            }
            if(vm.widgetPlaceholder){
                latestData.placeholder = vm.widgetPlaceholder;
            }
            if(vm.widgetFormatted || vm.widgetFormatted === false){
                latestData.formatted = vm.widgetFormatted;
            }
            console.log('CHECK -+ ');
            console.log(latestData);
            console.log(vm.widgetFormatted);
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