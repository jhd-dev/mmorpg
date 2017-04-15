'use strict';

var Game = require('../game/game');
var Player = require('../game/player');

var GAME = Game.init(['Player', 'Bullet']);
console.log(GAME);

var SOCKETS = {};
var fps = 50;

var commands = {
    w: function(socket, recipient, message){
        
    }
};

function eachSocket(fn){
    return Object.getOwnPropertySymbols(SOCKETS).map(id => {
        return fn(SOCKETS[id], id);
    });
}

module.exports = function(io){
    
    io.sockets.on('connection', function(socket){
        console.log('new socket');
        
        socket.id = Symbol();
        SOCKETS[socket.id] = socket;
        GAME.connect(socket);
        
        socket.on('disconnect', function(){
            console.log('removed socket');
            delete SOCKETS[socket.id];
            GAME.disconnect(socket);
        });
        
        socket.on('chatMsg', function(data){
            if (data.charAt(0) === '/'){
                var inputs = data.substr(1).split(' ');
                if (commands[inputs[0]]){
                    commands[inputs[0]].apply([socket].concat(inputs.slice(1)));
                }
            } else {
                eachSocket(socket => {
                    socket.emit('chatMsg', {
                        name: 'user123',
                        msg: data
                    });
                });
            }
        });
        
        socket.on('clientDebug', function(data){
            console.log(data);
        });
        
    });
    
    setInterval(function(){
        eachSocket(socket => {
            socket.emit('entities', GAME.update());
        });
    }, 1000 / fps);
    
};