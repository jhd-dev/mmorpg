'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').load();
var express = require('express');
var session = require('express-session');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var passportSocketIo = require('passport.socketio');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('./server/config/config');
var router = require('./server/routes/router');
var game_1 = require("./server/game-engine/game");
var gameInput = require('./shared/game/game-input');
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
server.listen(config.PORT, function () {
    console.log('Listening on port ' + config.PORT);
});
var io = require('socket.io')(server, {});
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: 'secret',
    store: sessionStorage
}));
var game = new game_1.default(gameInput);
io.sockets.on('connection', function (socket) {
    return game.onConnect(socket);
});
game.start(config.FPS);
