(function () {
    angular
        .module("WebMessenger")
        .controller("ProfileController", ProfileController)
        .controller("ExtProfileController", ExtProfileController)
        .controller("AdminController", AdminController);

    function ProfileController($rootScope, $routeParams, $mdToast, $mdDialog, $location, UserService, MapService) {
        var vm = this;
        vm.logout = logout;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.confirmDeregister = confirmDeregister;
        vm.setGeoLocation = setGeoLocation;
        vm.refreshMap = refreshMap;
        initializeData();

        function initializeData() {
            var promise = UserService.findUserById($routeParams.uid);
            promise
                .success(function (user) {
                    vm.user = user;
                    vm.username = user.username;
                    vm.firstName = user.firstName;
                    vm.lastName = user.lastName;
                    vm.email = user.email;
                    vm.phone = user.phone;
                    vm.aboutMe = user.aboutMe;
                    vm.caption = user.caption;
                    vm.location = user.location;
                    // refreshMap();
                })
                .error(function () {
                    console.log("Profile - User Find Error");
                });
        }
        
        function refreshMap() {
            var mapCentre = new google.maps.LatLng(vm.location.lat, vm.location.lng);
            var mapOptions = {
                zoom: 10,
                center: mapCentre,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };
            vm.map = new google.maps.Map(document.getElementById('map'), mapOptions);

            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Hello World!'
            });
        }

        function setGeoLocation() {
            var promise = MapService.getGeoLocation();
            promise
                .success(function(geocode){
                    var userDetails = {
                        _id: $routeParams.uid,
                        firstName: vm.firstName,
                        lastName: vm.lastName,
                        email: vm.email,
                        phone: vm.phone,
                        aboutMe: vm.aboutMe,
                        caption: vm.caption,
                        location : geocode.location
                    };
                    var promise = UserService.updateUser($routeParams.uid, userDetails);
                    promise
                        .success(function (user) {
                            var changeSuccess = "User Details Changed Successfully.";
                            initializeData();
                            showToast('success', changeSuccess);
                        })
                        .error(function () {
                            var error = "Update Failed.";
                            showToast('error', error);
                        });
                })
                .error(function(error){
                    console.log(error);
                });

        }

        function updateUser() {
            var userDetails = {
                _id: $routeParams.uid,
                firstName: vm.firstName,
                lastName: vm.lastName,
                email: vm.email,
                phone: vm.phone,
                aboutMe: vm.aboutMe,
                caption: vm.caption
            };
            var promise = UserService.updateUser($routeParams.uid, userDetails);
            promise
                .success(function (user) {
                    var changeSuccess = "User Details Changed Successfully.";
                    initializeData();
                    showToast('success', changeSuccess);
                })
                .error(function () {
                    var error = "Update Failed.";
                    showToast('error', error);
                });

        }

        function deleteUser() {
            var promise = UserService.deleteUser($routeParams.uid);
            promise
                .success(function (user) {
                    $location.url("/login");
                    var message = "User Deleted Successfully";
                    showToast('success', message);
                })
                .error(function () {
                    var error = "Delete Failed. Try Again Later.";
                    showToast('error', error);
                });
        }

        function confirmDeregister(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Confirm De-Registration')
                .textContent('This is permanent. Please Review your decision')
                .ariaLabel('De-Register Confirmation')
                .targetEvent(ev)
                .ok('Deregister')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                deleteUser();
            }, function () {
                showToast('neutral', 'Good Move!');
            });
        }

        function logout() {
            return UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                        var message = "Logged Out Successfully";
                        showToast('success', message);
                    },
                    function (error) {

                    });
        }


        function showToast(type, message) {
            if (type === 'error') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-error').textContent(message).position('top right'));
            }
            if (type === 'success') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-success').textContent(message).position('top right'));
            }
            if (type === 'neutral') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-success').textContent(message).position('top right'));
            }
            else {
                $mdToast.show($mdToast.simple().textContent(message).position('top right'));
            }
        }
    }

    function ExtProfileController($rootScope, $routeParams, $mdToast, $mdDialog, $location, UserService) {
        var vm = this;
        vm.logout = logout;
        initializeData();


        function initializeData() {
            var extPromise = UserService.findUserById($routeParams.extid);
            extPromise
                .success(function (user) {
                    vm.extUser = user;
                    vm.firstName = user.firstName;
                    vm.lastName = user.lastName;
                    vm.aboutMe = user.aboutMe;
                    vm.caption = user.caption;
                })
                .error(function () {
                    console.log("EXT-Profile - Ext User Find Error");
                });
            var promise = UserService.findUserById($routeParams.uid);
            promise
                .success(function (user) {
                    vm.user = user;
                    vm.primaryUId = vm.user._id;
                })
                .error(function () {
                    console.log("EXT-Profile - User Find Error");
                });
        }

        function logout() {
            return UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                        var message = "Logged Out Successfully";
                        showToast('success', message);
                    },
                    function (error) {

                    });
        }

        function showToast(type, message) {
            if (type === 'error') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-error').textContent(message).position('top right'));
            }
            if (type === 'success') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-success').textContent(message).position('top right'));
            }
            if (type === 'neutral') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-success').textContent(message).position('top right'));
            }
            else {
                $mdToast.show($mdToast.simple().textContent(message).position('top right'));
            }
        }
    }

    function AdminController(UserService) {
        var vm = this;
        vm.logout = logout;
        vm.deleteUser = deleteUser;
        init();


        function init() {
            var promise = UserService.findAllUsers();
            promise
                .success(function (users) {
                    vm.users = users;
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function deleteUser(userId) {
            var promise = UserService.deleteUser(userId);
            promise
                .success(function (status) {
                    init();
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function logout() {
            return UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                        var message = "Logged Out Successfully";
                        showToast('success', message);
                    },
                    function (error) {

                    });
        }

    }
})();