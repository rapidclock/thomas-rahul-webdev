module.exports = function(mongoose, userModel){
	var websiteSchema = require('./website.schema.server.js')(mongoose);
	var websiteModel = mongoose.model('Website', websiteSchema);

	var api = {
		'createWebsiteForUser' : createWebsiteForUser,
		'findAllWebsitesForUser' : findAllWebsitesForUser,
		'findWebsiteById' : findWebsiteById,
		'updateWebsite' : updateWebsite,
		'removePageFromWebsite' : removePageFromWebsite,
		'deleteWebsite' : deleteWebsite
	};

	return api;

	// Function Definition Section

	function createWebsiteForUser(userId, website){
		var newWebsite = {
			_user : userId,
			name : website.name,
			pages : []
		};
		if(website.description){
            newWebsite.description = website.description;
		}
		return websiteModel
			.create(newWebsite)
			.then(
				function (website){
					if(website){
						userModel
							.findUserById(userId)
							.then(
								function(user){
									user.websites.push(website._id);
									user.save();
                                    return websiteModel.findById(website._id);
								},
								function(error){
									return error;
								}
							);
					}
				},
				function (error){
					return error;
				}
			);
	}


	function findAllWebsitesForUser(userId){
		return websiteModel.find({_user : userId});
	}

	function findWebsiteById(websiteId){
		return websiteModel.findById(websiteId);
	}

	function updateWebsite(websiteId, website){
		return websiteModel.update({
			_id : websiteId
		}, {
			name : website.name,
			description : website.description
		});
	}

	function removePageFromWebsite(websiteId, pageId){
		// return websiteModel.update(
		// 	{ _id : websiteId},
		// 	{ $pull : {pages : pageId}}
		// );
		websiteModel
			.findById(websiteId)
			.then(
				function (website){
					website.pages.pull(pageId);
					website.save();
				},
				function (error){
					console.log(error);
				}
			);
	}

    function deleteWebsiteFromUser(websiteId){
        websiteModel
            .findById(websiteId)
            .then(
                function (website){
                    var userId = website._user;
                    userModel.removeWebsiteFromUser(userId, websiteId);
                },
                function(error){
                    console.log("Error Deleting Website From user" + error);
                }
            );

    }

	function deleteWebsite(websiteId){
        deleteWebsiteFromUser(websiteId);
        return websiteModel.findByIdAndRemove(websiteId);
	}


	
};