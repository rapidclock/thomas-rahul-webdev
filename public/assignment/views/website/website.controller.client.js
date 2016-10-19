(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
    }
    function NewWebsiteController($routeParams, WebsiteService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
        vm.createNew = createNew;

        function createNew(){
            if(vm.websiteName === null || vm.websiteName === undefined){
                return;
            }
            newWebsite = {
                name: vm.websiteName,
                desc: vm.websiteDesc
            };
            WebsiteService.createWebsite(vm.uid, newWebsite);
            vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
            vm.websiteName = null;
            vm.websiteDesc = null;
        }
    }
    function EditWebsiteController($routeParams, $location, $window, WebsiteService, PageService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
        vm.currentWebsite = WebsiteService.findWebsiteById(vm.wid);
        vm.currentWebsiteName = vm.currentWebsite.name;
        vm.currentWebsiteDesc = vm.currentWebsite.desc;
        vm.editWebsite = editWebsite;
        vm.deleteWebsite = deleteWebsite;

        function editWebsite(){
            var latestData = {
                name: vm.currentWebsiteName,
                desc: vm.currentWebsiteDesc
            };
            WebsiteService.updateWebsite(vm.wid, latestData);
            vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
            $location.url("/user/"+vm.uid+"/website");
        }

        function deleteWebsite(){
            WebsiteService.deleteWebsite(vm.wid);
            PageService.deletePagesByWebsite(vm.wid);
            $location.url("/user/"+vm.uid+"/website");
        }
    }
})();