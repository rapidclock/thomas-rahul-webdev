module.exports = function(mongoose, pageModel){
	var widgetSchema = require('./widget.schema.server.js')(mongoose);
	// var widgetModel = mongoose.model('Widget', widgetSchema);

	var api = {
		'createWidget' : createWidget,
		'findAllWidgetsForPage' : findAllWidgetsForPage,
		'findWidgetById' : findWidgetById,
		'updateWidget' : updateWidget,
		'deleteWidget' : deleteWidget,
		'reorderWidget' : reorderWidget,
        setModel : setModel
	};

	return api;

    function setModel(_model){
        model = _model;
    }
	// Function Definition Section

	function createWidget(pageId, widget){
		var newWidget = {
			_page : pageId,
            widgetType : widget.widgetType,
			name : widget.name,
			text : widget.text,
			deletable : true
		};
		if(widget.description){
			newWidget.description = widget.description;
		}
		if(widget.placeholder){
			newWidget.placeholder = widget.placeholder;
		}
		if(widget.url){
			newWidget.url = widget.url;
		}
		if(widget.width){
			newWidget.width = widget.width;
		}
		if(widget.height){
			newWidget.height = widget.height;
		}
		if(widget.rows){
			newWidget.rows = widget.rows;
		}
		if(widget.size){
			newWidget.size = widget.size;
		}
		if(widget.class){
			newWidget.class = widget.class;
		}
		if(widget.icon){
			newWidget.icon = widget.icon;
		}
		if(widget.formatted){
			newWidget.formatted = widget.formatted;
		}

		return widgetModel
			.create(newWidget)
			.then(
				function (widget){
					pageModel
						.findPageById(pageId)
						.then(
							function (page) {
								page.widgets.push(widget._id);
								page.save();
								return widgetModel.findById(widget._id);
                            },
							function (error){
								console.log(error);
							}
						);
				},
				function (error){
					console.log(error);
				}
			);
	}

	function findAllWidgetsForPage(pageId){
        return pageModel
            .findPageById(pageId)
            .then(
                function (page){
                    var widgetIdList = page.widgets;
                    return new Promise(function(resolve, reject){
                    	resolve(widgetIdList);
					});
                },
                function (error){
                    console.log(error);
                }
            );
	}

	function findWidgetById(widgetId){
		return widgetModel.findById(widgetId);
	}

	function updateWidget(widgetId, widget){
        var newWidget = {
        	name : widget.name,
            type : widget.type,
            text : widget.text,
            deletable : true
        };
        if(widget.description){
            newWidget.description = widget.description;
        }
        if(widget.placeholder){
            newWidget.placeholder = widget.placeholder;
        }
        if(widget.url){
            newWidget.url = widget.url;
        }
        if(widget.width){
            newWidget.width = widget.width;
        }
        if(widget.height){
            newWidget.height = widget.height;
        }
        if(widget.rows){
            newWidget.rows = widget.rows;
        }
        if(widget.size){
            newWidget.size = widget.size;
        }
        if(widget.class){
            newWidget.class = widget.class;
        }
        if(widget.icon){
            newWidget.icon = widget.icon;
        }
        if(widget.formatted || widget.formatted === false){
            newWidget.formatted = widget.formatted;
        }

        return widgetModel.findByIdAndUpdate(widgetId, newWidget);
	}

	function deleteWidgetFromPage(widgetId) {
		widgetModel
			.findById(widgetId)
			.then(
				function(widget){
					var pageId = widget._page;
					pageModel.removeWidgetFromPage(pageId, widgetId);
				},
				function(error){
					console.log(error);
				}
			)
    }

	function deleteWidget(widgetId){
		deleteWidgetFromPage(widgetId);
		return widgetModel.findByIdAndRemove(widgetId);
	}
	
	function reorderWidget(pageId, start, end){
		// pretty pointless, but keeping just in case.
		return pageModel.reorderWidget(pageId, start, end);
	}

};