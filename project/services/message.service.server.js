module.exports = function (app, model) {
    /* REST API SECTION */
    // POST Calls.
    app.post('/rest/msg', createMessage);
    // GET Calls.
    app.get('/rest/msg/:mid', getMessageById);
    app.get('/rest/msg/chat/:cid', getMessagesByChatId);
    // DELETE Calls.
    app.delete('/rest/msg/chat/:cid', deleteAllMessages);

    /* Function Definitions */

    function createMessage(req, res) {
        var message = req.body;
        model
            .messageModel
            .createMessage(message)
            .then(function (newMessage) {
                    res.json(newMessage);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function getMessageById(req, res) {
        var messageId = req.params.mid;
        model
            .messageModel
            .findMessageById(messageId)
            .then(function (message) {
                    res.json(message);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function getMessagesByChatId(req, res) {
        var chatId = req.params.cid;
        model
            .messageModel
            .findMessageByChatId(chatId)
            .then(function (messages) {
                    res.json(messages)
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function deleteAllMessages(req, res) {
        var chatId = req.params.cid;
        model
            .messageModel
            .deleteByChatId(chatId)
            .then(function (data) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }
};