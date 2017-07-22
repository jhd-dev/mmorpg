'use strict';

require('dotenv').load();
const express = require('express');
const session = require('express-session');
const http = require('http');
const fs = require('fs');
const profiler = require('v8-profiler');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSocketIo = require('passport.socketio');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./server/config/config');
const router = require('./server/routes/router');
const Game = require('./server/game/game');

require('./server/config/passport')(passport);

mongoose.connect(config.MONGO_URI);
mongoose.Promise = global.Promise;

let sessionStorage = new session.MemoryStore();

let app = express();

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

let server = http.Server(app);
server.listen(config.PORT, function(){
    console.log('Listening on port ' + config.PORT);
});

let io = require('socket.io')(server, {});
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: 'secret',
    store: sessionStorage,
    //fail: onAuthorizeFail
}));

let GAME = new Game(['Player', 'Bullet', 'Enemy', 'ItemDrop']);

io.sockets.on('connection', socket => GAME.onConnect(socket));

GAME.start(config.FPS);

setProfiling();

/*function onAuthorizeSuccess(data, accept){
    return accept();
}

function onAuthorizeFail(data, message, err, accept){
    if (err) throw new Error(message);
    //console.log(message);
    //console.log(data);
    return accept();
}*/

function setProfiling(){
    profiler.startProfiling('1', true);
    setTimeout(() => {
        let profile1 = profiler.stopProfiling('1');
        profile1.export((err, result) => {
            if (err) throw err;
            fs.writeFile('../profile.cpuprofile', result);
            profile1.delete();
            console.log('Profile saved.');
        }, 10000);
    });
}
