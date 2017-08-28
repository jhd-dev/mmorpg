'use strict';

const tmxParser = require('tmx-parser');
const Room = require('./room');

class Zone {
    
    constructor(GAME, name, mapName, sprites){
        this.GAME = GAME;
        this.name = name;
        this.mapName = mapName;
        this.sprites = sprites;
        this.rooms = [];
        this.getMap((err, map) => {console.log(map);
            if (err) throw err;
            this.map = map;
            this.createRoom();
        });
    }
    
    getMap(callback){
        /*$.ajax({
            url: mapDir + this.mapName + '.tmx',
            dataType: 'xml',
            error: callback,
            success: console.log
        })*/
        tmxParser.parseFile(this.GAME.mapDir + '/' + this.mapName + '.tmx', callback);
    }
    
    prepare(client){
        client.sendPrepPack({
            sprites: this.sprites,
            mapName: this.mapName
        });
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
    
    createRoom(){
        this.rooms.push(new Room(this.GAME, this, this.map, this.mapName));
    }
    
    removeRoom(id){
        
    }
    
}

module.exports = Zone;
