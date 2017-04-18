'use strict';

require('dotenv').load();
var express = require('express');
var session = require('express-session');
var http = require('http');
var fs = require('fs');
var profiler = require('v8-profiler');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var config = require('./server/config/config');
var routes = require('./server/routes/router');
var events = require('./server/sockets/events');

require('./server/config/passport')(passport);

mongoose.connect(config.MONGO_URI);
mongoose.Promise = global.Promise;

var app = express();

app.use('/', express.static(__dirname + '/client'));
app.use('/shared', express.static(__dirname + '/shared'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser());

routes(app, passport);

var server = http.Server(app);
server.listen(config.PORT, function(){
    console.log('Listening on port ' + config.PORT);
});

var io = require('socket.io')(server, {});
events(io);

profiler.startProfiling('1', true);
setTimeout(function(){
    var profile1 = profiler.stopProfiling('1');
    profile1.export(function(err, result){
        if (err) throw err;
        fs.writeFile('./profile.cpuprofile', result);
        profile1.delete();
        console.log('Profile saved.');
    }, 10000);
});
