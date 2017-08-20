'use strict';

/**
 * A room to hold and manage a set of entities, keeping connected clients updated too
 */
class Room {
    
    constructor(GAME, zone, map, mapName){
        this.id = String(Math.random());
        this.GAME = GAME;
        this.objects = this.GAME.objects;
        this.zone = zone;
        this.map = map;
        this.width = map.width;
        this.height = map.height;
        this.clients = {};
        this.entities = {Entity: {}};
        Object.keys(this.objects).forEach(className => {
            this.entities[className] = {};
        });
        this.prevPack = {
            entities: {}
        };
        this.removed = [];
        this.enemySpawnCounter = 0;
        let test = this.create('Enemy', [Math.random() * this.width, Math.random() * this.height, 'Evil Monster', 10, 180]);
    }
    
    enter(client){
        this.clients[client.id] = client;
        this.addEntity(client.player);
        client.player.room = this;
        client.sendInitPack(this.getInitPack(client));
    }
    
    leave(client){
        client.player.destroy();
        delete this.clients[client.id];
    }
    
    getInitPack(client){
        let entities = {};
        Object.keys(this.entities.Entity).forEach(id => {
            entities[id] = this.entities.Entity[id].getClientPack();
        });
        return {
            entities: entities,
            clientId: client.player.id,
            map: this.mapName
        };
    }
    
    update(){
        if (this.enemySpawnCounter % (7000 / 20) === 0 
            && Object.keys(this.entities.Enemy).length < 3 
            && Object.keys(this.entities.Player).length
        ){
            this.create('Enemy', [Math.random() * this.width, Math.random() * this.height, 'Evil Monster', 10, 180]);
        }
        this.enemySpawnCounter ++;
        
        let prevPack = this.prevPack;
        let newPack = {
            entities: {}
        };
        let updatePack = {
            entities: {},
            removed: this.removed.slice()
        };
        this.removed = [];
        //Object.keys(this.entities).forEach(className => {//console.log(className);
        newPack.entities = {};//console.log('this.entities',this.entities,'this.entities',this.entities);
        Object.keys(this.entities.Entity).forEach(id => {
            if (this.entities.Entity[id]){
                this.entities.Entity[id].update();
                if (this.entities.Entity[id]){
                    newPack.entities[id] = this.entities.Entity[id].getClientPack();
                }
            }
        });
        //console.log(newPack);
        if (!prevPack.entities){
            prevPack.entities = {};
        }
        Object.keys(prevPack.entities).forEach(id => {//console.log(id);
            let changed = false;
            if (newPack.entities[id]){//console.log('exists');
                for (let key in prevPack.entities[id]){
                    if (prevPack.entities[id][key] !== newPack.entities[id][key]){
                        changed = true;//console.log(`new ${key}: ${newPack.entities[id][key]}, old: ${prevPack.entities[id][key]}`);
                        if (!updatePack.entities){
                            //updatePack.entities = {};
                        }
                        if (!updatePack.entities[id]){
                            updatePack.entities[id] = {};
                        }
                        updatePack.entities[id][key] = newPack.entities[id][key];//console.log(updatePack.entities[id][key]);
                    }
                    //if (changed) console.log(updatePack.entities);
                }
                //console.log(updatePack.entities);
            }
            //if (changed) console.log(updatePack.entities);
        });
        Object.keys(newPack.entities).forEach(id => {//console.log(id);
            if (!prevPack.entities[id]){
                if (!updatePack.entities){
                    updatePack.entities = {};
                }
                updatePack.entities[id] = newPack.entities[id];
            }
        });
        //});
        //console.log(updatePack);
        this.updatePack = updatePack;
        this.prevPack = newPack;
    }
    
    sendUpdate(){
        if (Object.keys(this.updatePack.entities).length){
            Object.keys(this.clients).forEach(clientId => {
                let client = this.clients[clientId];
                //this.updatePack.inventory = socket.player.inventory.getClientPack(); console.log(socket.player);
                client.sendUpdate(this.updatePack);
            });
        }
    }
    
    create(type, args = []){
        let entity = this.GAME.create(type, this, args);
        this.addEntity(entity);
        return entity;
    }
    
    addEntity(entity){
        entity.types.forEach(type => {console.log(type);
            this.entities[type] = this.entities[type] || {};
            this.entities[type][entity.id] = entity;
        });
    }
    
    remove(entity){
        this.removed.push({
            types: entity.types,
            id: entity.id
        });
        entity.types.forEach(type => { //console.log('deleting ' + type);
            delete this.entities[type][entity.id];
        });
    }
    
    removeRoom(){
        this.zone.removeRoom(this.id);
    }
    
    detectPointCollision(x, y){
        let gridX = Math.floor(x / this.tileSize);
        let gridY = Math.floor(y / this.tileSize);
        if (this.grid[gridY]){
            if (typeof this.grid[gridY][gridX] !== 'undefined'){
                return this.grid[gridY][gridX];
            }
            return true;
        }
        return true;
    }
    
    checkSpecialTiles(entity){
        
    }
    
    forEachInstance(type, fn){
        return Object.keys(this.entities[type]).map((instanceId, i, arr) => {
            return fn(this.entities[type][instanceId], i, arr);
        });
    }
    
}

module.exports = Room;
