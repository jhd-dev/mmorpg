'use strict';

var User = require('../models/user');

var Game = {
        
    init: (gameClassNames) => {
        Game.objects = {};
        gameClassNames.forEach(className => {
            Game.objects[className] = require('./' + className.toLowerCase());
            Game.objects[className].GAME = Game;
            Game.objects[className].instances = {};
        });
        return Game;
    },
    
    connect: (socket) => {
        return Game.objects.Player.connect(socket);
    },
    
    disconnect: (socket) => {
        Game.saveUser(socket);
        return Game.objects.Player.disconnect(socket);
    },
    
    update: () => {
        var pack = {};
        Object.keys(Game.objects).forEach(className => {
            pack[className] = Game.objects[className].update();
        });
        return pack;
    },
    
    create: (className, args = []) => {
        return new Game.objects[className](Game, ...args);
    },
    
    saveUser: (socket) => {
        var player = socket.player;
        User.findOne({
            username: player.name,
        }, {
            x: player.x,
            y: player.y
        }, (err, user) => {
            if (err) throw err;
        });
    },
    
    loadUser: (username, password, callback) => {
        User.findOne({
            username
        }, (err, user) => {
            if (err) throw err;
            
            if (user){
                if (user.password === password){
                    callback('', user);
                }
            } else {
                callback('User not found', null);
            }
        });
    }
    
};

module.exports = Game;
