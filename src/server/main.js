'use strict';

const config = require('./config/config');
const Game = require('./game/game');
const Client = require('./game/client');

module.exports = function(io){
    let GAME = new Game(['Player', 'Bullet', 'Enemy', 'ItemDrop']);
    
    io.sockets.on('connection', socket => {
        console.log('new socket');
        let client = new Client(socket, GAME);
        client.onConnect();
    });
    
    GAME.start(config.FPS);
};
