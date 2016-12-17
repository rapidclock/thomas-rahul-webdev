module.exports = function (mongoose, userModel) {
    var chatSchema = require('../../schema/comm/chat.schema.server')(mongoose);
    var chatModel = mongoose.model('Chat', chatSchema);

    var api = {
        'createChat': createChat,
        'findChatById': findChatById,
        'findChatByUserIds': findChatByUserIds,
        'updateChat': updateChat,
        'deleteChat': deleteChat
    };
    return api;

    function createChat(chat) {
        var newChat = {
            users: chat.users,
            messages: []
        };
        return chatModel
            .create(newChat)
            .then(function (chat) {
                    return userModel
                        .findUserById(chat.users[0])
                        .then(
                            function (user) {
                                user.chats.push(chat._id);
                                user.save();
                                return userModel
                                    .findUserById(chat.users[1])
                                    .then(
                                        function (user) {
                                            user.chats.push(chat._id);
                                            user.save();
                                            return chatModel.findById(chat._id);
                                        },
                                        function (error) {
                                            return error;
                                        }
                                    );
                            },
                            function (error) {
                                return error;
                            }
                        );
                },
                function (error) {
                    console.log(error);
                });
    }

    function findChatById(chatId) {
        return chatModel.findById(chatId);
    }

    function findChatByUserIds(userIds) {
        return chatModel.findOne({users: {$all: userIds}});
    }

    function updateChat(chatId, chat) {
        return chatModel.update({
            _id: chatId
        }, {
            users: chat.users
        });
    }

    function deleteChatsfromUsers(chatId) {
        chatModel
            .findById(chatId)
            .then(
                function (chat) {
                    var userIds = chat.users;
                    for (u in userIds) {
                        userModel.removeChatFromUser(userIds[u], chatId);
                    }
                },
                function (error) {
                    console.log("Error Deleting Website From user" + error);
                }
            );
    }

    function deleteChat(chatId) {
        deleteChatsfromUsers(chatId);
        return chatModel.findByIdAndRemove(chatId);
    }

};