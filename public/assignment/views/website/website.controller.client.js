(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.websites = [];

        init();

        function init() {
            var promise = WebsiteService.findWebsitesByUser(vm.uid);
            promise
                .success(function (websites) {
                    if (websites.length > 0) {
                        vm.websites = websites;
                    } else {
                        vm.websites = [];
                    }
                })
                .error(function () {
                    console.log("Error retrieving websites.");
                });
        }
    }

    function NewWebsiteController($routeParams, $timeout, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        init();

        vm.createNew = createNew;

        function init() {
            var promise = WebsiteService.findWebsitesByUser(vm.uid);
            promise
                .success(function (websites) {
                    if (websites.length > 0) {
                        vm.websites = websites;
                    } else {
                        vm.websites = [];
                    }
                })
                .error(function () {
                    console.log("Error retrieving websites.")
                });
        }

        function createNew() {
            if (vm.websiteName === null || vm.websiteName === undefined || vm.websiteName === "") {
                vm.errorText = "Website Name Cannot be Blank";
                $timeout(function () {
                    vm.errorText = null;
                }, 3500);
                return;
            }
            newWebsite = {
                name: vm.websiteName,
                description: vm.websiteDesc
            };
            var promise = WebsiteService.createWebsite(vm.uid, newWebsite);
            promise
                .success(function () {
                    init();
                    vm.websiteName = null;
                    vm.websiteDesc = null;
                })
                .error(function () {
                    vm.errorText = "Server Error. Try after a while.";
                    $timeout(function () {
                        vm.errorText = null;
                    }, 3500);
                });
        }
    }

    function EditWebsiteController($routeParams, $location, $window, WebsiteService, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        init();
        vm.editWebsite = editWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            var sitePromise = WebsiteService.findWebsiteById(vm.wid);
            sitePromise
                .success(function (website) {
                    vm.currentWebsite = website;
                    vm.currentWebsiteName = vm.currentWebsite.name;
                    vm.currentWebsiteDesc = vm.currentWebsite.description;
                })
                .error(function () {
                    console.log("Error retrieving data");
                });

            var allSitePromise = WebsiteService.findWebsitesByUser(vm.uid);
            allSitePromise
                .success(function (websites) {
                    if (websites.length > 0) {
                        vm.websites = websites;
                    } else {
                        vm.websites = [];
                    }
                })
                .error(function () {
                    console.log("Error retrieving websites.")
                });
        }

        function editWebsite() {
            if (vm.currentWebsiteName === null || vm.currentWebsiteName === undefined || vm.currentWebsiteName === "") {
                vm.errorText = "Website Name Cannot be Blank";
                $timeout(function () {
                    vm.errorText = null;
                }, 3500);
                return;
            }
            var latestData = {
                name: vm.currentWebsiteName,
                description: vm.currentWebsiteDesc
            };
            var promise = WebsiteService.updateWebsite(vm.wid, latestData);
            promise
                .success(function () {
                    $location.url("/user/" + vm.uid + "/website");
                })
                .error(function () {

                });
        }

        function deleteWebsite() {
            var promise = WebsiteService.deleteWebsite(vm.wid);
            promise
                .success(function(){
                    // var allDeletePromise = PageService.deletePagesByWebsite(vm.wid);
                    // allDeletePromise
                    //     .success(function () {
                    //         // $location.url("/user/" + vm.uid + "/website");
                    //     })
                    //     .error(function () {
                    //         console.log("Server Error Deleting all Pages");
                    //     });
                    $location.url("/user/" + vm.uid + "/website");
                })
                .error(function(){
                    console.log("Server Error Deleting Website");
                });
        }
    }
})();