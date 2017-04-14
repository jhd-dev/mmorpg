'use strict';

var Player = require('../game/player');
var Bullet = require('../game/bullet');

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
        Player.connect(socket);
        
        socket.on('disconnect', function(){
            console.log('removed socket');
            delete SOCKETS[socket.id];
            Player.disconnect(socket);
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
    
    var update = setInterval(function(){
        var pack = {
            players: Player.update(),
            bullets: Bullet.update()
        };
        eachSocket(socket => {
            socket.emit('entities', pack);
        });
    }, 1000 / fps);
    
};