/**
 * Created by RT on 17/09/16.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({ secret: 'secretsauce', resave : true, saveUninitialized : true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
    res.redirect('/index.html')
});

app.use(express.static(__dirname + '/public'));

var mongoose = require('mongoose');
var connectionString = 'mongodb://localhost:27017/wms';

// if (process.env.MLAB_WM_ASGN_DB_USERNAME) {
//     connectionString = process.env.MLAB_WM_DB_URL_INIT +
//         process.env.MLAB_WM_ASGN_DB_USERNAME + ":" +
//         process.env.MLAB_WM_ASGN_DB_PASSWORD +
//         process.env.MLAB_WM_ASGN_DB_URL_END + '/' +
//         process.env.MLAB_WM_ASGN_DB_NAME;
// }
if (process.env.MLAB_DB_VAR_FLAG) {
    connectionString = process.env.MLAB_CONN_STRING;
}
mongoose.connect(connectionString);


require("./assignment/app")(app, mongoose);
require("./project/app")(app, mongoose);
// require ("./test/app.js")(app);

app.set('ipaddress', (process.env.IP));
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), app.get('ipaddress'));



