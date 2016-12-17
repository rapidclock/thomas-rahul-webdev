module.exports = function (app, mongoose) {
    var models = require("./models/models.server")(mongoose);
    require("./services/abstract.service.server")(app);
    require("./services/user.service.server.js")(app, models);
    require("./services/chat.service.server")(app, models);
    require("./services/message.service.server")(app, models);
};