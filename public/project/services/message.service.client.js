(function () {
    angular
        .module("WebMessenger")
        .factory('MessageService', MessageService);

    function MessageService($http) {
        var api = {
            'createMessage': createMessage,
            'findMessageById': findMessageById,
            'findMessageByChatId': findMessageByChatId,
            'deleteByChatId': deleteByChatId
        };
        return api;

        function createMessage(message) {
            var url = '/rest/msg';
            return $http.post(url, message);
        }

        function findMessageById(messageId) {
            var url = '/rest/msg/' + messageId;
            return $http.get(url);
        }

        function findMessageByChatId(chatId) {
            var url = '/rest/msg/chat/' + chatId;
            return $http.get(url);
        }

        function deleteByChatId(chatId) {
            var url = '/rest/msg/chat/' + chatId;
            return $http.delete(url);
        }
    }
})();