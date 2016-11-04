module.exports = function(app) {
    var websites = [
        {_id: "123", name: "Facebook", developerId: "456", desc: "Test01"},
        {_id: "234", name: "Tweeter", developerId: "456", desc: "Test02"},
        {_id: "456", name: "Gizmodo", developerId: "456", desc: "Test03"},
        {_id: "567", name: "Tic Tac Toe", developerId: "123", desc: "Test04"},
        {_id: "678", name: "Checkers", developerId: "123", desc: "Test05"},
        {_id: "789", name: "Chess", developerId: "234", desc: "Test06"}
    ];

    // POST Calls.
    app.post('/api/user/:uid/website', createEntity);

    // GET Calls.
    app.get('/api/user/:uid/website', getAllWebsites);
    app.get('/api/website/:wid', getWebsiteById);

    // PUT Calls.
    app.put('/api/website/:wid', updateDetails);

    // DELETE Calls.
    app.delete('/api/website/:wid', deleteFromSystem);
    app.delete('/api/user/:uid/website', deleteAllFromSystem);

    /* REST Functions */
    function createEntity(req, res){
        var uid = req.params.uid;
        var website = req.body;
        var newWebsite = createWebsite(uid, website);
        if(newWebsite){
            res.sendStatus(200);
        } else {
            // Internal Server Error.
            res.sendStatus(500);
        }
    }

    function getAllWebsites(req, res){
        var uid = req.params.uid;
        var allWebsites = findWebsitesByUser(uid);
        res.send(allWebsites);
    }

    function getWebsiteById(req, res){
        var wid = req.params.wid;
        var website = findWebsiteById(wid);
        res.send(website);
    }

    function updateDetails(req, res){
        var wid = req.params.wid;
        var website = req.body;
        updateWebsite(wid,website);
        res.sendStatus(200);
    }

    function deleteFromSystem(req, res){
        var wid = req.params.wid;
        deleteWebsite(wid);
        res.sendStatus(200);
    }

    function deleteAllFromSystem(req, res){
        var uid = req.params.uid;
        deleteWebsitesByUser(uid);
        res.send(200);
    }

    /* Standard CRUD Operations */

    function getNextId() {
        return new Date().getTime();
    }

    function createWebsite(userId, website) {
        var newWebsiteId = getNextId();
        var newWebsite = {
            _id: newWebsiteId,
            name: website.name,
            desc: website.desc,
            developerId: userId
        };
        websites.push(newWebsite);
        return newWebsite;
    }

    function findWebsitesByUser(userId) {
        result = [];
        for (w in websites) {
            var website = websites[w];
            if (parseInt(website.developerId) === parseInt(userId)) {
                result.push(website);
            }
        }
        return result;
    }

    function findWebsiteById(websiteId) {
        for (w in websites) {
            var website = websites[w];
            if (parseInt(website._id) === parseInt(websiteId)) {
                return website;
            }
        }
        return null;
    }

    function updateWebsite(websiteId, website) {
        var oldWebsite = findWebsiteById(websiteId);
        var index = websites.indexOf(oldWebsite);
        websites[index].name = website.name;
        websites[index].desc = website.desc;
    }

    function deleteWebsite(websiteId) {
        var oldWebsite = findWebsiteById(websiteId);
        var index = websites.indexOf(oldWebsite);
        websites.splice(index, 1);
    }

    function deleteWebsitesByUser(userId) {
        for (w in websites) {
            website = websites[w];
            if (website.developerId === userId) {
                deleteWebsite(website._id);
            }
        }
    }
};