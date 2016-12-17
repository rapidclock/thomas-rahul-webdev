module.exports = function (app, model) {
    /* REST API SECTION */
    // POST Calls.
    app.post('/rest/chat', createChat);
    app.get('/rest/chat/users', getChatByUsers);
    // GET Calls.

    app.get('/rest/chat/:cid', getChatById);
    // PUT Calls.
    app.put('/rest/chat/:cid', updateChat);
    // DELETE Calls.
    app.delete('/rest/chat/:cid', deleteChat);

    /* Function Definitions */

    function createChat(req, res) {
        var chat = req.body;
        model
            .chatModel
            .createChat(chat)
            .then(function (newChat) {
                    res.json(newChat);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function getChatByUsers(req, res) {
        var users = req.body;
        model
            .chatModel
            .findChatByUserIds(users)
            .then(function (chat) {
                    res.json(chat);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function getChatById(req, res) {
        var chatId = req.params.cid;
        model
            .chatModel
            .findChatById(chatId)
            .then(function (chat) {
                    res.json(chat);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function updateChat(req, res) {
        var chatId = req.params.cid;
        var chat = req.body;
        model
            .chatModel
            .updateChat(chatId, chat)
            .then(function (updChat) {
                    res.json(updChat)
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function deleteChat(req, res) {
        var chatId = req.params.cid;
        model
            .chatModel
            .deleteChat(chatId)
            .then(function (data) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }
};