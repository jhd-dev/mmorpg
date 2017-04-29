'use strict';

var User = require('../models/user');

var pathToObjects = './';

class Game {
    
    constructor(gameClassNames = [], maps = {}){
        this.objects = {};
        gameClassNames.forEach(className => {
            this.objects[className] = require(pathToObjects + className.toLowerCase());
            this.objects[className].GAME = this;
            this.objects[className].instances = {};
        });
        
        this.maps = Object.keys(maps).reduce((acc, name) => new Map(name, maps[name].grid, maps[name].tileSize), {});
        
        this.prevPack = {
            entities: {}
        };
        this.enemySpawnCounter = 0;
    }
    
    connect (socket){
        return this.objects.Player.connect(socket);
    }
    
    disconnect(socket){
        this.saveUser(socket);
        return this.objects.Player.disconnect(socket);
    }
    
    update(){
        var prevPack = this.prevPack;
        
        if (this.enemySpawnCounter % (8000 / 20) === 0 
            && Object.keys(this.objects.Enemy.instances).length < 3 
            && Object.keys(this.objects.Player.instances).length
        ){
            this.create('Enemy', [Math.random() * 800, Math.random() * 600, 'Evil Monster', 10, 180]);
        }
        this.enemySpawnCounter ++;
        
        var newPack = {
            entities: {}
        };
        var updatePack = {
            entities: {},
            removed: []
        };
        Object.keys(this.objects).forEach(className => {//console.log(className);
            newPack.entities[className] = this.objects[className].update();
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
        this.prevPack = newPack;
        return updatePack;
    }
    
    create(className, args = []){
        return new this.objects[className](this, ...args);
    }
    
    saveUser(socket){
        var player = socket.player;
        User.findOne({
            username: player.name,
        }, {
            x: player.x,
            y: player.y
        }, (err, user) => {
            if (err) throw err;
        });
    }
    
    getInitPack(socket){
        var entities = {};
        Object.keys(this.objects).forEach(className => {
            entities[className] = this.objects[className].getClientPack();
        });
        return {
            entities: entities,
            clientId: socket.id
        };
    }
    
}

module.exports = Game;
