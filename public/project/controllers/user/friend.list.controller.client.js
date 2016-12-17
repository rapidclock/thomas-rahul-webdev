(function () {
    angular
        .module("WebMessenger")
        .controller("FriendListController", FriendListController);

    function FriendListController($timeout, $q, $rootScope, $routeParams, $mdToast, $mdDialog, $location, UserService) {
        var vm = this;
        vm.logout = logout;
        vm.findFriends = findFriends;
        vm.addFriend = addFriend;
        vm.deFriend = deFriend;
        initialize();
        // vm.allUserList = loadAll();
        loadAll();


        function initialize() {
            var promise = UserService.findUserById($routeParams.uid);
            promise
                .success(function (user) {
                    vm.user = user;
                    vm.uid = user._id;
                    refreshFriendsList(user.friends);
                })
                .error(function () {
                    console.log("FriendList - User Find Error");
                });
        }

        function refreshFriendsList(friendIds) {
            var friendsList = [];
            for (i = 0; i < friendIds.length; i++) {
                var promise = UserService.findUserById(friendIds[i]);
                promise
                    .success(function (friend) {
                        if (friend) {
                            friendsList.push(friend);
                        }
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
            vm.friendsList = friendsList;
        }

        function addFriend() {
            if (vm.selectedItem === null || vm.selectedItem === "" || vm.selectedItem === undefined) {
                showToast('neutral', 'Search for a friend first.');
                return;
            }
            var userId = vm.selectedItem._id;
            UserService
                .addFriend(vm.user._id, userId)
                .success(function (success) {
                    initialize();
                    showToast('success', vm.selectedItem.username + ' is now your Friend');
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function deFriend(friendId) {
            UserService
                .deleteFriend(vm.user._id, friendId)
                .success(function (success) {
                    initialize();
                    showToast('success', 'Defriended Successfully');
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function findFriends(query) {
            var allUL = vm.allUserList;
            return query ? allUL.filter(createFilterFor(query)) : [];
        }

        /**
         * Build `components` list of key/value pairs
         */
        function loadAll() {
            var promise = UserService.findAllUsers();
            promise
                .success(function (users) {
                    var allUsers = users;
                    vm.allUserList = allUsers.map(function (user) {
                        user.username = user.username.toLowerCase();
                        return user;
                    });
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function (item) {
                return (item.username.indexOf(lowercaseQuery) === 0) && (item._id !== vm.user._id) && (item.username !== 'root');
            };

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
                $mdToast.show($mdToast.simple().toastClass('md-toast-neutral').textContent(message).position('top right'));
            }
            else {
                $mdToast.show($mdToast.simple().textContent(message).position('top right'));
            }
        }
    }
})();