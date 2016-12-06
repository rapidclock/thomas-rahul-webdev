module.exports = function(mongoose, websiteModel){
	var pageSchema = require('./page.schema.server.js')(mongoose);
	var pageModel = mongoose.model('Page', pageSchema);

	var api = {
		'createPage' : createPage,
		'findAllPagesForWebsite' : findAllPagesForWebsite,
		'findPageById' : findPageById,
		'updatePage' : updatePage,
		'updateWidgetsForPage' : updateWidgetsForPage,
		'removeWidgetFromPage' : removeWidgetFromPage,
		// 'findAllWidgetsForPage' : findAllWidgetsForPage,
        'reorderWidget' : reorderWidget,
		'deletePage' : deletePage
	};

	return api;

	// Function Definition Section
	
	function createPage(websiteId, page){
		var newPage = {
			_website : websiteId,
			name : page.name,
			widgets : []
		};
		if(page.title){
			newPage.title = page.title;
		}
		if(page.description){
			newPage.description = page.description;
		}
		return pageModel
			.create(newPage)
			.then(
				function (page){
					if(page){
						websiteModel
							.findWebsiteById(websiteId)
							.then(
								function (website){
									website.pages.push(page._id);
									website.save();
									return pageModel.findById(page._id);
								},
								function (error){
									return error;
								}
							);
					}
				},
				function (error) {
					return error;
                }
			);
	}

	function findAllPagesForWebsite(websiteId){
		return pageModel.find({_website : websiteId});
	}

	function findPageById(pageId){
		return pageModel.findById(pageId);
	}

	function updatePage(pageId, page){
		var updPage = {
            name : page.name
		};
		if(updPage.title){
			updPage.title = page.title;
		}
		if(updPage.description){
			updPage.description = page.description;
		}
		return pageModel.update({
			_id : pageId
		}, updPage);
	}

	function updateWidgetsForPage(pageId, widget){
	}

	function deletePageFromWebsite(pageId){
		pageModel
			.findById(pageId)
			.then(
				function (page){
					var websiteId = page._website;
					websiteModel.removePageFromWebsite(websiteId, pageId);
				},
				function (error){
					console.log(error);
				}
			);
	}

	function removeWidgetFromPage(pageId, widgetId){
		pageModel
			.findById(pageId)
			.then(
				function (page){
					page.widgets.pull(widgetId);
					page.save();
				},
				function (error){
					console.log(error);
				}
			)
	}

	function deletePage(pageId){
        deletePageFromWebsite(pageId);
		return pageModel.remove({_id : pageId});
	}


	function reorderWidget(pageId, start, end){
		return pageModel
			.findById(pageId)
			.then(
				function (page){
                    var widget = page.widgets.splice(start, 1)[0];
                    page.widgets.splice(end, 0, widget);
                    page.save();
                    return new Promise(function(resolve,reject){
                    	resolve();
					});
				},
				function(error){
					return new Promise(function(resolve, reject){
						reject(error);
					});
				}
			);
	}
};