'use strict';

var config = require('../config/config');
var maps = require('../config/maps');
var Game = require('../game/game');

var GAME = new Game(['Player', 'Bullet', 'Enemy', 'ItemDrop']);

var SOCKETS = {};
var fps = config.FPS;

var commands = {
    pm: function(socket, recipient, message){console.log('pm');
        var recipientId = Object.keys(SOCKETS).find(id => SOCKETS[id].player.name === recipient);
        if (SOCKETS[recipientId]){
            SOCKETS[recipientId].emit('chatMsg', {
                name: socket.player.name,
                msg: message,
                type: 'private',
                recipient: SOCKETS[recipientId].player.name
            });
            socket.emit('chatMsg', {
                name: socket.player.name,
                msg: message,
                type: 'private',
                recipient: SOCKETS[recipientId].player.name
            });
        }
    }
};

function eachSocket(fn){
    return Object.keys(SOCKETS).map(id => {
        return fn(SOCKETS[id], id);
    });
}

module.exports = function(io){
    
    io.sockets.on('connection', function(socket){
        console.log('new socket');
        
        var player = GAME.connect(socket);
        //console.log(player);
        socket.id = player.id;
        SOCKETS[socket.id] = socket;
        socket.player = player;
        //console.log(socket.request);
        if (socket.request.user.logged_in && socket.request.user.local){
            var user = socket.request.user;
            player.name = user.local.username;
            player.x = user.x;
            player.y = user.y;
        } else {
            player.name = 'Guest' + Math.floor(Math.random() * Math.pow(10, 5));
        }
        socket.emit('init', GAME.getInitPack(socket));
        
        socket.on('disconnect', function(){
            console.log('removed socket');
            if (socket.request.user){
                GAME.saveUser(socket);
            }
            delete SOCKETS[socket.id];
            GAME.disconnect(socket);
        });
        
        socket.on('chatMsg', function(data){
            if (data.charAt(0) === '/'){
                var inputs = data.substr(1).split(' '); console.log(inputs);
                if (commands[inputs[0]]){
                    commands[inputs[0]].apply(null, [socket].concat(inputs.slice(1)));
                }
            } else {
                eachSocket(socket => {
                    if (data.length > 0){
                        //console.log(GAME);
                        socket.emit('chatMsg', {
                            name: player.name,
                            msg: data,
                            type: 'normal'
                        });
                    }
                });
            }
        });
        
        socket.on('clientDebug', function(data){
            console.log(data);
        });
        
    });
    
    setInterval(function(){
        var pack = GAME.update();
        eachSocket(socket => {
            pack.inventory = socket.player.inventory.getClientPack();
            socket.emit('update', pack);
        });
    }, 1000 / fps);
    
};
