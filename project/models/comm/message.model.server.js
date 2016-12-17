module.exports = function (mongoose, chatModel, userModel) {
    var messageSchema = require('../../schema/comm/message.schema.server')(mongoose);
    var messageModel = mongoose.model('Message', messageSchema);

    var api = {
        'createMessage': createMessage,
        'findMessageById': findMessageById,
        'findMessageByChatId': findMessageByChatId,
        'deleteByChatId': deleteByChatId
    };
    return api;

    function createMessage(message) {
        var newMessage = {
            _chat: message._chat,
            userFrom: message.userFrom,
            userTo: message.userTo,
            content: message.content
        };
        return messageModel
            .create(newMessage)
            .then(function (message) {
                    return chatModel
                        .findChatById(message._chat)
                        .then(function (chat) {
                                chat.messages.push(message._id);
                                chat.save();
                                return new Promise(function (resolve, reject) {
                                    resolve(message);
                                });
                            },
                            function (error) {
                                return new Promise(function (resolve, reject) {
                                    reject(error);
                                });
                            });
                },
                function (error) {
                    return new Promise(function (resolve, reject) {
                        reject(error);
                    });
                });

    }

    function findMessageById(messageId) {
        return messageModel.findById(messageId);
    }

    function findMessageByChatId(chatId) {
        return messageModel.find({_chat: chatId});
    }

    function deleteByChatId(chatId) {
        // TODO check if this returns a promise.
        messageModel.remove({_chat: chatId}).exec();
    }
};