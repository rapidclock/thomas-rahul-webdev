module.exports = function (app) {

    /* REST API SECTION */
    // POST Calls.
    app.get('/rest/abstract/:imgType', getImage);

    function getImage(req, res) {
        var imgType = req.query.imgType;
        var imgId = req.params.imgId;
        var url = "";
        if (imgId === 'deflogin') {
            imgType = "defaults";
            // url = "../uploads/defaults/login_background.jpg"
            url = "login_background.jpg";
        }
        if (imgId === 'defregister') {
            imgType = "defaults";
            // url = "../uploads/defaults/register_background.jpg"
            url = "register_background.jpg";
        }
        // url = "../uploads/" + imgType + '/' + imgId;
        url = imgId;

        var options = {
            root: __dirname + "../uploads/" + imgType + "/",
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        res.sendFile(url, options, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
            else {
                console.log('Sent:', url);
            }
        });

    }


};