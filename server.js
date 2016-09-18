/**
 * Created by RT on 17/09/16.
 */
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

require ("./test/app.js")(app);

app.set('ipaddress', (process.env.IP));
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), app.get('ipaddress'));