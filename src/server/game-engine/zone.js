'use strict';

const fs = require('fs');
const tmxParser = require('tmx-parser');
const Room = require('./room');

class Zone {
    
    constructor(GAME, name, mapName){
        this.GAME = GAME;
        this.name = name;
        this.mapName = mapName;
        this.rooms = [];
        this.getMap((map, mapImage) => {console.log(map);
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
        tmxParser.parseFile(this.GAME.mapDir + '/' + this.mapName + '.tmx', (err, map) => {
            if (err) throw err;
            let mapImage = new Image();
            mapImage.src = this.GAME.mapDir + '/' + this.mapName + '.png';
            mapImage.onload = () => {
                callback(map, mapImage);
            };
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
        this.rooms.push(new Room(this.GAME, this, this.map));
    }
    
    eachSocket(fn){
        return Object.keys(this.rooms[0]).map(id => fn(this.rooms[0][id], id));
    }
    
    removeRoom(id){
        
    }
    
}

module.exports = Zone;
