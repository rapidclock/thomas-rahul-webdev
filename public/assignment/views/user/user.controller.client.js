(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, $timeout, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            var promise = UserService.findUserByCredentials(username, password);
            promise
                .success(function(user){
                    if (user === null || user === undefined || user === "") {
                        vm.error = "No Such User";
                    } else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function(){
                    vm.error = "Error Connecting to Server. Please try again later.";
                    $timeout(function () {
                        vm.error = null;
                    }, 5000);
                });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password, secondPassword) {
            if (username === undefined || username === null || username === "" || password === undefined || password === "") {
                vm.registerError = "Username and Passwords cannot be blank.";
                vm.username = null;
                return;
            }
            if (password !== secondPassword) {
                vm.registerError = "Passwords do not match.";
                return;
            }
            var user = UserService.findUserByUsername(username);
            if (user !== null) {
                user = {
                    username: username,
                    password: password,
                    firstName: "",
                    lastName: "",
                    email: ""
                };
                var promise = UserService.createUser(user);
                promise
                    .success(function(user){
                        $location.url("/user/" + user._id);
                    })
                    .error(function(){
                        vm.registerError = "Sorry, There was an issue. Our minions were not behaving themselves. v_v";
                    });
            }
            else {
                vm.registerError = "Sorry Username already Exists.";
            }
        }
    }

    function ProfileController($routeParams, $location, $timeout, UserService) {
        var vm = this;

        //vm.user = UserService.findUserById($routeParams.uid);
        // vm.username = vm.user.username;
        // vm.firstName = vm.user.firstName;
        // vm.lastName = vm.user.lastName;
        // vm.email = vm.user.email;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        init();

        function init(){
            var promise = UserService.findUserById($routeParams.uid);
            promise
                .success(function (user) {
                    vm.user = user;
                    vm.username = user.username;
                    vm.firstName = user.firstName;
                    vm.lastName = user.lastName;
                    vm.email = user.email;
                })
                .error(function () {
                    console.log("Profile - User Find Error");
                });
        }

        function updateUser() {
            var userDetails = {
                _id: $routeParams.uid,
                firstName: vm.firstName,
                lastName: vm.lastName,
                email: vm.email
            };
            var promise = UserService.updateUser($routeParams.uid, userDetails);
            promise
                .success(function (user) {
                    vm.changeSuccess = "User Details Changed Successfully.";
                    init();
                    $timeout(function () {
                        vm.changeSuccess = null;
                    }, 5000);
                })
                .error(function () {
                    vm.changeFailure = "Update Failed.";
                    $timeout(function(){
                        vm.changeFailure = null;
                    }, 3000);
                });

        }

        function deleteUser() {
            var promise = UserService.deleteUser($routeParams.uid);
            promise
                .success(function (user) {
                    if(user.username.includes("tina")){
                        vm.changeSuccess = "The Vivio, has left the website...";
                        $timeout(function () {
                            $location.url("/login");
                        }, 5000);
                        return;
                    }
                    $location.url("/login");
                })
                .error(function () {
                    vm.changeFailure = "Delete Failed. Try Again Later.";
                });
        }
    }
})();