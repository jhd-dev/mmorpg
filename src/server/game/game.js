'use strict';

const Zone = require('./zone');
const maps = require('../config/maps');

const pathToObjects = './';

class Game {
    
    constructor(gameClassNames = []){
        this.objects = {};
        gameClassNames.forEach(className => {
            this.objects[className] = require(pathToObjects + className.toLowerCase());
            this.objects[className].GAME = this.GAME;
            this.objects[className].instances = {};
        });
        console.log(this.objects);
        this.zones = {};
        Object.keys(maps).forEach(name => {
            this.zones[name] = new Zone(this, name, maps[name], maps[name].tileSize);
        });
        this.updateInterval = null;
    }
    
    start(fps){
        this.updateInterval = setInterval(() => {
            this.update();
            this.sendUpdate();
        }, 1000 / fps);
    }
    
    connect (socket){
        return this.zones['grass'].objects.Player.connect(socket);
    }
    
    update(){
        Object.keys(this.zones).forEach(zoneName => {
            this.zones[zoneName].update();
        });
    }
    
    sendUpdate(){
        Object.keys(this.zones).forEach(zoneName => {
            this.zones[zoneName].sendUpdate();
        });
    }
    
    create(type, room, args = []){
        return new this.objects[type](this, room, ...args);
    }
    
    eachSocket(fn){
        return Object.keys(this.sockets).map(id => fn(this.sockets[id], id));
    }
    
}

module.exports = Game;
