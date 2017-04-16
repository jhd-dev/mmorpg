'use strict';

var User = require('../models/user');
var setupGameClass = require('./setup-class');

var Game = {
        
    init: (gameClassNames) => {
        Game.gameClasses = {};
        gameClassNames.forEach(className => {
            Game.gameClasses[className] = setupGameClass(Game, require('./' + className.toLowerCase()));
        });
        return Game;
    },
    
    connect: (socket) => {
        return Game.gameClasses.Player.connect(socket);
    },
    
    disconnect: (socket) => {
        Game.saveUser(socket);
        return Game.gameClasses.Player.disconnect(socket);
    },
    
    update: () => {
        var pack = {};
        Object.keys(Game.gameClasses).forEach(className => {
            pack[className] = Game.gameClasses[className].update();
        });
        return pack;
    },
    
    create: (className, args) => {
        return new Game.gameClasses[className](Game, ...args);
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
