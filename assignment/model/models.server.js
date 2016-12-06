module.exports = function(){
	var mongoose = require('mongoose');
    var connectionString = 'mongodb://localhost:27017/test';

    if(process.env.MLAB_ASGN_DB_USERNAME) {
        connectionString = process.env.MLAB_DB_URL_INIT +
            process.env.MLAB_ASGN_DB_USERNAME + ":" +
            process.env.MLAB_ASGN_DB_PASSWORD +
            process.env.MLAB_ASGN_DB_URL_END + '/' +
            process.env.MLAB_ASGN_DB_NAME;
    }

    mongoose.connect(connectionString);

	var userModel = require('./user/user.model.server.js')(mongoose);
	var websiteModel = require('./website/website.model.server.js')(mongoose, userModel);
    var pageModel = require('./page/page.model.server.js')(mongoose, websiteModel);
    var widgetModel = require('./widget/widget.model.server.js')(mongoose, pageModel);

	var models = {
		'userModel' : userModel,
		'websiteModel' : websiteModel,
		'pageModel' : pageModel,
		'widgetModel' : widgetModel
	};

	return models;
};