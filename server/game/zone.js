'use strict';

var pathToObjects = './';

class Zone {
    
    constructor(GAME, name, grid, gameClassNames, tileSize = 16){
        this.GAME = GAME;
        this.name = name;
        this.grid = grid;
        this.width = grid[0].length * tileSize;
        this.height = grid.length * tileSize;
        this.tileSize = tileSize;
        this.rooms = [{}];
        
        this.objects = {};
        gameClassNames.forEach(className => {
            this.objects[className] = require(pathToObjects + className.toLowerCase());
            this.objects[className].GAME = this.GAME;
            this.objects[className].instances = {};
        });
        
        this.prevPack = {
            entities: {}
        };
        this.enemySpawnCounter = 0;
    }
    
    setup(){
        return this;
    }
    
    enter(client){
        this.rooms[0][client.socket.id] = client.socket;
        client.socket.emit('init', this.getInitPack(client.socket));
    }
    
    leave(client){
        delete this.rooms[0][client.id];
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
    
    update(){
        this.rooms.forEach(room => {
            var prevPack = this.prevPack;
        
            var newPack = {
                entities: {}
            };
            var updatePack = {
                entities: {},
                removed: []
            };
            Object.keys(this.objects).forEach(className => {//console.log(className);
                newPack.entities[className] = this.objects[className].update(); //console.log(newPack.entities[className]);
                if (!prevPack.entities[className]){
                    prevPack.entities[className] = {};
                }
                Object.keys(prevPack.entities[className]).forEach(id => {//console.log(id);
                    let changed = false;
                    if (newPack.entities[className][id]){//console.log('exists');
                        for (let key in prevPack.entities[className][id]){
                            if (prevPack.entities[className][id][key] !== newPack.entities[className][id][key]){changed=true;//console.log(`new ${key}: ${newPack.entities[className][id][key]}, old: ${prevPack.entities[className][id][key]}`);
                                if (!updatePack.entities[className]){
                                    updatePack.entities[className] = {};
                                }
                                if (!updatePack.entities[className][id]){
                                    updatePack.entities[className][id] = {};
                                }
                                updatePack.entities[className][id][key] = newPack.entities[className][id][key];//console.log(updatePack.entities[className][id][key]);
                            }
                            //if (changed) console.log(updatePack.entities[className]);
                        }
                        //console.log(updatePack.entities[className]);
                    } else {
                        updatePack.removed.push({
                            type: className,
                            id: id
                        });
                    }
                    if (changed) console.log(updatePack.entities[className]);
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
            //console.log(updatePack);
            this.updatePack = updatePack;
            this.prevPack = newPack;
        });
    }
    
    sendUpdate(){console.log(this.updatePack);
        this.rooms.forEach(room => {//console.log(room);
            this.eachSocket(socket => {//console.log(socket);
                //this.updatePack.inventory = socket.player.inventory.getClientPack(); console.log(socket.player);
                socket.emit('update', this.updatePack);
            });
        });
    }
    
    create(className, args = []){
        return new this.objects[className](this, ...args);
    }
    
    detectPointCollision(x, y){
        var gridX = Math.floor(x / this.tileSize);
        var gridY = Math.floor(y / this.tileSize);
        if (this.grid[gridY]){
            if (typeof this.grid[gridY][gridX] !== 'undefined'){
                return this.grid[gridY][gridX];
            }
            return true;
        }
        return true;
    }
    
    eachSocket(fn){
        return Object.keys(this.rooms[0]).map(id => fn(this.rooms[0][id], id));
    }
    
}

module.exports = Zone;
