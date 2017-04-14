'use strict';

var Player = require('../game/player');
var Bullet = require('../game/bullet');

var SOCKETS = {};
var fps = 50;

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
        
    });
    
    var update = setInterval(function(){
        var pack = {
            players: Player.update(),
            bullets: Bullet.update()
        };
        Object.getOwnPropertySymbols(SOCKETS).forEach(id => {
            SOCKETS[id].emit('entities', pack);
        });
    }, 1000 / fps);
    
};
