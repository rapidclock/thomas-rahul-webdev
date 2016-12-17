module.exports = function (mongoose) {
    var userModel = require('./user/user.model.server.js')(mongoose);
    var chatModel = require('./comm/chat.model.server')(mongoose, userModel);
    var messageModel = require('./comm/message.model.server')(mongoose, chatModel, userModel);

    var models = {
        'userModel': userModel,
        'chatModel': chatModel,
        'messageModel': messageModel
    };

    return models;
};