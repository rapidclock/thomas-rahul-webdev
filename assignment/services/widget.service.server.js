module.exports = function (app) {
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });

    var widgets = [
        {_id: "123", widgetType: "HEADER", pageId: "321", size: 2, name: "GIZZY", text: "GIZMODO"},
        {_id: "234", widgetType: "HEADER", pageId: "100", size: 4, name: "Ippsy", text: "Lorem ipsum"},
        {_id: "345", widgetType: "IMAGE", pageId: "321", name: "Lorem Pixel", text: "Pixel", width: "100", url: "http://lorempixel.com/400/200/"},
        {_id: "456", widgetType: "HTML", pageId: "321", name: "Ipsy", text: "<p>Lorem ipsum</p>"},
        {_id: "567", widgetType: "HEADER", pageId: "321", size: 4, name: "Lorrro", text: "Lorem ipsum"},
        {_id: "678", widgetType: "YOUTUBE", pageId: "321", name: "Dire Straits", text: "Sultans of Swing", width: "100", url: "https://www.youtube.com/embed/8Pa9x9fZBtY"},
        {_id: "789", widgetType: "HTML", pageId: "100", name: "Lorem", text: "<p>Lorem ipsum</p>"}
    ];

    // POST Calls.
    app.post('/api/page/:pid/widget', createEntity);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    // GET Calls.
    app.get('/api/page/:pid/widget', getAllWidgets);
    app.get('/api/widget/:wgid', getWidgetById);

    // PUT Calls.
    app.put('/api/widget/:wgid', updateDetails);

    // DELETE Calls.
    app.delete('/api/widget/:wgid', deleteFromSystem);
    app.delete('/api/page/:pid/widget', deleteAllFromSystem);


    /* REST Functions */

    function uploadImage(req, res) {
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;


        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;
        res.send(200);
    }

    function createEntity(req, res){
        var pid = parseInt(req.params.pid);
        var widget = req.body;
        var newWidget = createWidget(pid, widget);
        if(newWidget){
            res.sendStatus(200);
        } else {
            // Internal Server Error.
            res.sendStatus(500);
        }
    }

    function getAllWidgets(req, res){
        var pid = parseInt(req.params.pid);
        var allWidgets = findWidgetsByPageId(pid);
        res.send(allWidgets);
    }

    function getWidgetById(req, res){
        var wgid = parseInt(req.params.wgid);
        var widget = findWidgetById(wgid);
        res.send(widget);
    }

    function updateDetails(req, res){
        var wgid = parseInt(req.params.wgid);
        var widget = req.body;
        updateWidget(wgid, widget);
        res.sendStatus(200);
    }

    function deleteFromSystem(req, res){
        var wgid = parseInt(req.params.wgid);
        deleteWidget(wgid);
        res.sendStatus(200);
    }

    function deleteAllFromSystem(req, res){
        var pid = parseInt(req.params.pid);
        deleteWidgetsByPage(pid);
        res.sendStatus(200);
    }

    /*
     * Standard CRUD
     */
    function createWidget(pageId, widget) {
        widgets.push(widget);
        return(findWidgetById(widget._id));
    }

    function findWidgetsByPageId(pageId) {
        results = [];
        function filterByPageId(widget) {
            return parseInt(widget.pageId) === pageId;
        }
        results = widgets.filter(filterByPageId);
        return results;
    }

    function findWidgetById(widgetId) {
        for (wid in widgets) {
            var widget = widgets[wid];
            if (parseInt(widget._id) === widgetId) {
                return widget;
            }
        }
        return null;
    }

    function updateWidget(widgetId, widget) {
        var oldWidget = findWidgetById(widgetId);
        var index = widgets.indexOf(oldWidget);
        if (oldWidget.widgetType !== widget.widgetType) {
            return;
        }
        Object.keys(widget).forEach(function (property) {
            if (property === '_id' || property === 'widgetType' || property === 'pageId') {
                return;
            }
            if (oldWidget.hasOwnProperty(property)) {
                oldWidget[property] = widget[property];
            }
        });
    }

    function deleteWidget(widgetId) {
        var oldWidget = findWidgetById(widgetId);
        var index = widgets.indexOf(oldWidget);
        widgets.splice(index, 1);
    }

    function deleteWidgetsByPage(pageId) {
        for (wid in widgets) {
            widget = widgets[wid];
            if (parseInt(widget.pageId) === pageId) {
                deleteWidget(widget._id);
            }
        }
    }

};