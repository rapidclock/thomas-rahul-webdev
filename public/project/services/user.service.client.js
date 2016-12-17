(function () {
    angular
        .module("WebMessenger")
        .factory('UserService', UserService);

    function UserService($http) {
        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "findAllUsers": findAllUsers,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "deleteFriend": deleteFriend,
            "addFriend": addFriend,
            "login": login,
            "logout": logout,
            "register": register
        };
        return api;

        // Passport Section

        function login(user) {
            return $http.post("/rest/login", user);
        }

        function logout() {
            return $http.post("/rest/logout");
        }

        function register(user) {
            return $http.post("/rest/register", user);
        }

        // Rest of Functions
        function createUser(user) {
            var url = "/rest/user";
            return $http.post(url, user);
        }

        function findUserById(userId) {
            var url = "/rest/user/" + userId;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = "/rest/users/uname?" + "username=" + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = "/rest/user?" + "username=" + username + "&" + "password=" + password;
            return $http.get(url);
        }

        function findAllUsers() {
            var url = "/rest/users/all";
            return $http.get(url);
        }

        function deleteFriend(userIdA, userIdB) {
            var url = "/rest/friend?" + "userIdA=" + userIdA + "&" + "userIdB=" + userIdB;
            return $http.delete(url);
        }

        function addFriend(userIdA, userIdB) {
            var url = "/rest/friend?" + "userIdA=" + userIdA + "&" + "userIdB=" + userIdB;
            return $http.post(url);
        }

        function updateUser(userId, user) {
            var url = "/rest/user/" + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            var url = "/rest/user/" + userId;
            return $http.delete(url);
        }
    }
})();