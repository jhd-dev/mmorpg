'use strict';

const Client = require('./client');
const Zone = require('./zone');
const gameData = require('../config/game-data');

const pathToObjects = './';

class Game {
    
    constructor(gameClassNames = []){
        this.objects = {};
        gameClassNames.forEach(className => {
            this.objects[className] = require(pathToObjects + className.toLowerCase());
            this.objects[className].GAME = this.GAME;
            this.objects[className].instances = {};
        });
        //console.log(this.objects);
        this.zones = {};
        Object.keys(gameData.zones).forEach(zoneName => {
            this.zones[zoneName] = new Zone(this, zoneName, gameData.zones[zoneName].mapName);
        });
        this.updateInterval = null;
    }
    
    start(fps){
        this.updateInterval = setInterval(() => {
            this.update();
            this.sendUpdate();
        }, 1000 / fps);
    }
    
    onConnect (socket){
        let client = new Client(socket, this);
        client.onConnect();
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
