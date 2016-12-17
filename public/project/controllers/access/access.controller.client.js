(function () {
    angular
        .module("WebMessenger")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController);

    function LoginController($rootScope, $location, $timeout, $mdToast, UserService) {
        var vm = this;
        // vm.bgUrl = "http://wallpaperlayer.com/img/2015/1/blurred-beach-wallpaper-7599-7893-hd-wallpapers.jpg";
        vm.bgUrl = "./uploads/defaults/login_background.jpg";
        vm.login = login;

        function login(uname, paswd) {
            var userData = {
                username: uname,
                password: paswd
            };
            UserService
                .findUserByCredentials(uname, paswd)
                .then(
                    function (response) {
                        var user = response.data;
                        if (user === null || user === undefined || user === "") {
                            var error = "Either the user doesn't exist or Password is incorrect.";
                            showToast('error', error);
                        } else {
                            UserService
                                .login(userData)
                                .then(
                                    function (response) {
                                        var user = response.data;
                                        $rootScope.currentUser = user;
                                        $location.url("/user/" + user._id);
                                    },
                                    function (error) {
                                        var error = "Error Connecting to Server. Please try again later.";
                                        showToast('error', error);
                                        $timeout(function () {
                                            vm.error = null;
                                        }, 5000);
                                    });
                        }
                    },
                    function (error) {
                        var error = "Error Connecting to Server. Please try again later.";
                        showToast('error', error);
                        $timeout(function () {
                            vm.error = null;
                        }, 5000);
                    });

        }

        function showToast(type, message) {
            if (type === 'error') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-error').textContent(message).position('top right'));
            }
            if (type === 'success') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-success').textContent(message).position('top right'));
            } else {
                $mdToast.show($mdToast.simple().textContent(message).position('top right'));
            }
        }
    }

    function RegisterController($rootScope, $location, $timeout, $mdToast, UserService) {
        var vm = this;
        // vm.bgUrl = "http://www.walldevil.com/wallpapers/a85/backgrounds-high-resolution-blurred-background1-blur-light-blue.jpg";
        vm.bgUrl = "./uploads/defaults/register_background.jpg";
        vm.register = register;

        function register() {
            if (vm.password !== vm.secondPassword) {
                var error = "Passwords do not match.";
                showToast('error', error);
                return;
            }
            var userDetail = {
                username: vm.username,
                password: vm.password,
                firstName: vm.firstName,
                lastName: vm.lastName,
                email: vm.email,
                phone: vm.phone
            };
            UserService
                .findUserByUsername(userDetail.username)
                .then(
                    function (response) {
                        var user = response.data;
                        if (user !== "") {
                            var error = "Sorry Username already Exists.";
                            showToast('error', error);
                        }
                        else {
                            var promise = UserService.register(userDetail);
                            promise
                                .success(function (response) {
                                    var userData = response;
                                    $rootScope.currentUser = userData;
                                    $location.url("/user/" + userData._id);
                                })
                                .error(function () {
                                    var error = "Sorry, There was an issue. Our minions were not behaving themselves. v_v";
                                    showToast('error', error);
                                });
                        }
                    },
                    function (error) {
                        console.log(error);
                    }
                );

            console.log('Registered');
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
})();