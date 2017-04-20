'use strict';

var User = require('../models/user');

var pathToObjects = './';

var Game = {
    
    prevPack: {
        entities: {}
    },
    enemySpawnCounter: 0,
    
    init: (gameClassNames) => {
        Game.objects = {};
        gameClassNames.forEach(className => {
            Game.objects[className] = require(pathToObjects + className.toLowerCase());
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
        var prevPack = Game.prevPack;
        
        if (Game.enemySpawnCounter % (8000 / 20) === 0 
            && Object.keys(Game.objects.Enemy.instances).length < 3 
            && Object.keys(Game.objects.Player.instances).length
        ){
            Game.create('Enemy', [Math.random() * 800, Math.random() * 600, 'Evil Monster', 10, 180]);
        }
        Game.enemySpawnCounter ++;
        
        var newPack = {
            entities: {}
        };
        var updatePack = {
            entities: {},
            removed: []
        };
        Object.keys(Game.objects).forEach(className => {//console.log(className);
            newPack.entities[className] = Game.objects[className].update();
            if (!prevPack.entities[className]){
                prevPack.entities[className] = {};
            }
            Object.keys(prevPack.entities[className]).forEach(id => {//console.log(id);
                if (newPack.entities[className][id]){
                    for (var key in prevPack.entities[className][id]){
                        if (prevPack.entities[className][id][key] !== newPack.entities[className][id][key]){
                            if (!updatePack.entities[className]){
                                updatePack.entities[className] = {};
                            }
                            if (!updatePack.entities[className][id]){
                                updatePack.entities[className][id] = {};
                            }
                            updatePack.entities[className][id][key] = newPack.entities[className][id][key];
                        }
                    }
                } else {
                    updatePack.removed.push({
                        type: className,
                        id: id
                    });
                }
            });
            Object.keys(newPack.entities[className]).forEach(id => {//console.log(id);
                if (!prevPack.entities[className][id]){
                    if (!updatePack.entities[className]){
                        updatePack.entities[className] = {};
                    }
                    updatePack.entities[className][id] = newPack.entities[className][id];
                }
            });
        });
        if (updatePack.removed.length) console.log(updatePack.removed);
        Game.prevPack = newPack;
        return updatePack;
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
    },
    
    getInitPack: (socket) => {
        var entities = {};
        Object.keys(Game.objects).forEach(className => {
            entities[className] = Game.objects[className].getClientPack();
        });
        return {
            entities: entities,
            clientId: socket.id
        };
    }
    
};

module.exports = Game;
