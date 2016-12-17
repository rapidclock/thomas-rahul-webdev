(function () {
    angular
        .module("WebMessenger")
        .factory('ChatService', ChatService);

    function ChatService($http) {
        var api = {
            'createChat': createChat,
            'findChatById': findChatById,
            'findChatByUserIds': findChatByUserIds,
            'updateChat': updateChat,
            'deleteChat': deleteChat
        };
        return api;


        function createChat(chat) {
            var url = '/rest/chat';
            return $http.post(url, chat);
        }

        function findChatById(chatId) {
            var url = '/rest/chat/' + chatId;
            return $http.get(url);
        }

        function findChatByUserIds(userIds) {
            var url = '/rest/chat/users';
            return $http.post(url, userIds);
        }

        function updateChat(chatId, chat) {
            var url = '/rest/chat/' + chatId;
            return $http.put(url, chat);
        }

        function deleteChat(chatId) {
            var url = '/rest/chat/' + chatId;
            return $http.delete(url);
        }
    }
})();