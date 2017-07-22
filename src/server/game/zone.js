'use strict';

const Room = require('./room');

class Zone {
    
    constructor(GAME, name, grid, tileSize = 16){
        this.GAME = GAME;
        this.name = name;
        this.grid = grid;
        this.width = grid[0].length * tileSize;
        this.height = grid.length * tileSize;
        this.tileSize = tileSize;
        this.rooms = [new Room(GAME, this, grid)];
    }
    
    setup(){
        return this;
    }
    
    enter(client){
        this.rooms[0].enter(client);
    }
    
    update(){
        this.rooms.forEach(room => room.update());
    }
    
    sendUpdate(){
        this.rooms.forEach(room => room.sendUpdate());
    }
    
    create(className, args = []){
        return new this.objects[className](this, ...args);
    }
    
    eachSocket(fn){
        return Object.keys(this.rooms[0]).map(id => fn(this.rooms[0][id], id));
    }
    
    removeRoom(id){
        
    }
    
}

module.exports = Zone;
