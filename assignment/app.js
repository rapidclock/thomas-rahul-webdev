module.exports = function(app, mongoose){
	var model = require("./model/models.server.js")(mongoose);
    require("./services/user.service.server.js")(app, model);
    require("./services/website.service.server.js")(app, model);
    require("./services/page.service.server")(app, model);
    require("./services/widget.service.server")(app, model);
};
