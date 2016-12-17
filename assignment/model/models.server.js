module.exports = function(mongoose){
    var userModel = require('./user/user.model.server.js')(mongoose);
    var websiteModel = require('./website/website.model.server.js')(mongoose, userModel);
    var pageModel = require('./page/page.model.server.js')(mongoose, websiteModel);
    var widgetModel = require('./widget/widget.model.server.js')(mongoose, pageModel);

    var model = {
		userModel : userModel,
		websiteModel : websiteModel,
		pageModel : pageModel,
		widgetModel : widgetModel
    };

    // userModel.setModel(model);
    // websiteModel.setModel(model);
    // pageModel.setModel(model);
    // widgetModel.setModel(model);


    return model;

    //
    // var userModel = require("./user/user.model.server.js")(mongoose);
    // var websiteModel = require("./website/website.model.server.js")(mongoose);
    // var pageModel =  require("./page/page.model.server.js")(mongoose);
    // var widgetModel = require("./widget/widget.model.server.js")(mongoose);
    //
    // var model = {
    //     userModel : userModel,
    //     websiteModel : websiteModel,
    //     pageModel : pageModel,
    //     widgetModel : widgetModel
    // };
    //
    // userModel.setModel(model);
    // websiteModel.setModel(model);
    // pageModel.setModel(model);
    // widgetModel.setModel(model);
    //
    // return model;
};