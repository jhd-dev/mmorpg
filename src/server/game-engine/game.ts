'use strict';

const Client = require('./client');
const Zone = require('./zone');

class Game {
    
    fps: number;
    mapDir: string;
    objects: Object;
    zones: Object;
    updateInterval: any;
    
    constructor(input){
        this.fps = input.fps;
        this.mapDir = input.mapDir;
        this.objects = {};
        Object.keys(input.objects).forEach(className => this.addGameObject(className, input.objects[className]));
        //console.log(this.objects);
        this.zones = {};
        Object.keys(input.zones).forEach(zoneName => {
            this.zones[zoneName] = new Zone(this, zoneName, input.zones[zoneName].mapName, input.zones[zoneName].sprites);
        });
        this.updateInterval = null;
    }
    
    addGameObject(className, pathToClass){
        this.objects[className] = require(pathToClass);
        this.objects[className].GAME = this;
    }
    
    start(fps = this.fps){
        this.updateInterval = setInterval(() => {
            this.update();
            this.sendUpdate();
        }, 1000 / fps);
    }
    
    stop(){
        clearInterval(this.updateInterval);
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
    
}

module.exports = Game;
export default Game;
