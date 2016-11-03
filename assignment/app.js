module.exports = function(app){
    require("./services/widget.service.server")(app);
    require("./services/user.service.server.js")(app);
}
