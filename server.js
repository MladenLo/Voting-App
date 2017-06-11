var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
require('dotenv').load();


var apiUserRoutes = require('./server-app/routes/api-user-routes');
var apiPollRoutes = require('./server-app/routes/api-poll-routes');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//set static directory, which is /dist directory created by angular cli(webpack). From there angular app will pull all files it needs
app.use(express.static(__dirname + "/angular-app/dist"));

/*
    Serving the index.html file which starts angular app.
    Don't run angular application just in browser on your mashine, it needs http protocol to do it correctly.
*/
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'angular-app/dist/index.html'));
});

// REST API endpoints
app.use('/api/user/', apiUserRoutes);
app.use('/api/poll/', apiPollRoutes);
//Serve the app for every request. I dont like hashbang in URL :)
app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname,'angular-app/dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});