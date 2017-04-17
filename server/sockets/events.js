'use strict';

var Game = require('../game/game');

var GAME = Game.init(['Player', 'Bullet']);
console.log(GAME);

var SOCKETS = {};
var fps = 50;

var commands = {
    w: function(socket, recipient, message){
        
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
        socket.id = player.id;
        SOCKETS[socket.id] = socket;
        socket.player = player;
        
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
                    if (data.length > 0){
                        //console.log(GAME);
                        socket.emit('chatMsg', {
                            name: player.name,
                            msg: data
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
            socket.emit('entities', pack);
        });
    }, 1000 / fps);
    
};
