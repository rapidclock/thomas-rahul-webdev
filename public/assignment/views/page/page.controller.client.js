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
        vm.pages = PageService.findPageByWebsiteId(vm.wid);
    }
    function NewPageController($routeParams, PageService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pages = PageService.findPageByWebsiteId(vm.wid);
        vm.createPage = createPage;
        
        function createPage() {
            if(vm.pageName === null || vm.pageName === undefined){
                return;
            }
            var newPage = {
                name: vm.pageName,
                title: vm.pageTitle
            };
            PageService.createPage(vm.wid, newPage);
            vm.pages = PageService.findPageByWebsiteId(vm.wid);
            vm.pageName = null;
            vm.pageTitle = null;
        }
    }
    function EditPageController($routeParams, $location, PageService, WidgetService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        vm.pages = PageService.findPageByWebsiteId(vm.wid);
        vm.currentPage = PageService.findPageById(vm.pid);
        vm.pageName = vm.currentPage.name;
        vm.pageTitle = vm.currentPage.title;

        vm.editPage = editPage;
        vm.deletePage = deletePage;
        
        function editPage() {
            var latestData = {
                name: vm.pageName,
                title: vm.pageTitle
            };
            PageService.updatePage(vm.pid, latestData);
            $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page");
        }
        
        function deletePage() {
            PageService.deletePage(vm.pid);
            //
            $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page");
        }
    }
})();