(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        var promise = PageService.findPageByWebsiteId(vm.wid);
        promise
            .success(function (pages) {
                vm.pages = pages;
            })
            .error(function () {
                console.log("Error retrieving pages.");
            });
    }
    function NewPageController($routeParams, $timeout, PageService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        init();
        vm.createPage = createPage;

        function init(){
            var promise = PageService.findPageByWebsiteId(vm.wid);
            promise
                .success(function (pages) {
                    vm.pages = pages;
                })
                .error(function () {
                    console.log("Error retrieving pages.");
                });
        }

        function createPage() {
            if(vm.pageName === null || vm.pageName === undefined || vm.pageName === ""){
                vm.errorText = "Page Name Cannot be Blank";
                $timeout(function(){
                    vm.errorText = null;
                }, 3500);
                return;
            }
            var newPage = {
                name: vm.pageName,
                title: vm.pageTitle
            };

            PageService.createPage(vm.wid, newPage);
            init();
            vm.pageName = null;
            vm.pageTitle = null;
        }
    }
    function EditPageController($routeParams, $location, $timeout, PageService, WidgetService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        // vm.pages = PageService.findPageByWebsiteId(vm.wid);
        // vm.currentPage = PageService.findPageById(vm.pid);
        // vm.pageName = vm.currentPage.name;
        // vm.pageTitle = vm.currentPage.title;
        init();
        vm.editPage = editPage;
        vm.deletePage = deletePage;

        function init(){
            var pagesPromise = PageService.findPageByWebsiteId(vm.wid);
            pagesPromise
                .success(function (pages) {
                    vm.pages = pages;
                })
                .error(function () {
                    console.log("Error retrieving pages.");
                });
            var pagePromise = PageService.findPageById(vm.pid);
            pagePromise
                .success(function(page){
                    vm.currentPage = page;
                    vm.pageName = vm.currentPage.name;
                    vm.pageTitle = vm.currentPage.title;
                })
                .error(function(){
                    console.log("Error retrieving page.");
                })
        }

        function editPage() {
            if(vm.pageName === null || vm.pageName === undefined || vm.pageName === ""){
                vm.errorText = "Page Name Cannot be Blank";
                $timeout(function(){
                    vm.errorText = null;
                }, 3500);
                return;
            }
            var latestData = {
                name: vm.pageName,
                title: vm.pageTitle
            };
            var promise = PageService.updatePage(vm.pid, latestData);
            promise
                .success(function () {
                    $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page");
                })
                .error(function () {
                    console.log("Error updating Data");
                });
        }
        
        function deletePage() {
            PageService.deletePage(vm.pid);
            $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page");
        }
    }
})();