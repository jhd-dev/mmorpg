'use strict';

require('dotenv').load();
var express = require('express');
var session = require('express-session');
var http = require('http');
var fs = require('fs');
var profiler = require('v8-profiler');
var mongoose = require('mongoose');
var passport = require('passport');
var passportSocketIo = require('passport.socketio');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var main = require('./server/main');
var config = require('./server/config/config');
var router = require('./server/routes/router');

require('./server/config/passport')(passport);

mongoose.connect(config.MONGO_URI);
mongoose.Promise = global.Promise;

var sessionStorage = new session.MemoryStore();

var app = express();

app.use('/', express.static(__dirname + '/client'));
app.use('/shared', express.static(__dirname + '/shared'));

app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    key: 'express.sid',
    store: sessionStorage
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(router(passport));

var server = http.Server(app);
server.listen(config.PORT, function(){
    console.log('Listening on port ' + config.PORT);
});

var io = require('socket.io')(server, {});
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: 'secret',
    store: sessionStorage,
    //fail: onAuthorizeFail
}));

main(io);

setProfiling();

function onAuthorizeSuccess(data, accept){
    return accept();
}

function onAuthorizeFail(data, message, err, accept){
    if (err) throw new Error(message);
    //console.log(message);
    //console.log(data);
    return accept();
}

function setProfiling(){
    profiler.startProfiling('1', true);
    setTimeout(function(){
        var profile1 = profiler.stopProfiling('1');
        profile1.export(function(err, result){
            if (err) throw err;
            fs.writeFile('../profile.cpuprofile', result);
            profile1.delete();
            console.log('Profile saved.');
        }, 10000);
    });
}
