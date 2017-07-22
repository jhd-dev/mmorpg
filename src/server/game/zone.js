'use strict';

const tmxParser = require('tmx-parser');
const Room = require('./room');

const mapDir = __dirname + '/maps/';

class Zone {
    
    constructor(GAME, name, mapName){
        this.GAME = GAME;
        this.name = name;
        this.mapName = mapName;
        this.rooms = [];
        this.getMap((err, map) => {
            if (err) throw err;
            this.map = map;
            this.rooms[0] = new Room(GAME, this, this.map);
        });
    }
    
    getMap(callback){
        /*$.ajax({
            url: mapDir + this.mapName + '.tmx',
            dataType: 'xml',
            error: callback,
            success: console.log
        })*/
        tmxParser.parseFile(mapDir + this.mapName + '.tmx', callback);
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
