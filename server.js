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
    res.redirect('/assignment/index.html')
});

app.use(express.static(__dirname + '/public'));

require("./assignment/app")(app);
// require ("./test/app.js")(app);

app.set('ipaddress', (process.env.IP));
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), app.get('ipaddress'));



