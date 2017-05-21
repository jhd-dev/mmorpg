'use strict';

var config = require('./config/config');
var Game = require('./game/game');
var Client = require('./game/client');

module.exports = function(io){
    
    var GAME = new Game(['Player', 'Bullet', 'Enemy', 'ItemDrop']);
    var fps = config.FPS;
    
    io.sockets.on('connection', socket => {
        console.log('new socket');
        
        var client = new Client(socket, GAME);
        client.onConnect();
        
        socket.on('disconnect', () => client.onDisconnect());
        
        socket.on('chatMsg', () => client.onChatMsg());
        
        socket.on('clientDebug', data => {
            console.log(data);
        });
        
    });
    
    GAME.start(fps);
    
};
