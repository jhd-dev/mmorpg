'use strict';

var Zone = require('./zone');
var User = require('../models/user');
var maps = require('../config/maps');

var pathToObjects = './';

class Game {
    
    constructor(gameClassNames = []){
        this.zones = {};
        Object.keys(maps).forEach(name => {
            this.zones[name] = new Zone(this, name, maps[name], gameClassNames, maps[name].tileSize);
        });
        
        this.sockets = {};
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
    
    disconnect(socket){
        this.saveUser(socket);
        return socket.player.zone.objects.Player.disconnect(socket);
    }
    
    update(){
        if (this.enemySpawnCounter % (8000 / 20) === 0 
            && Object.keys(this.zones['grass'].objects.Enemy.instances).length < 3 
            && Object.keys(this.zones['grass'].objects.Player.instances).length
        ){
            this.create('Enemy', [Math.random() * 800, Math.random() * 600, 'Evil Monster', 10, 180]);
        }
        this.enemySpawnCounter ++;
        
        Object.keys(this.zones).forEach(zoneName => {
            this.zones[zoneName].update();
        });
    }
    
    sendUpdate(){
        Object.keys(this.zones).forEach(zoneName => {
            this.zones[zoneName].sendUpdate();
        });
    }
    
    create(className, args = []){
        return new this.zones['grass'].objects[className](this, ...args);
    }
    
    saveUser(socket){
        var player = socket.player;
        User.findOneAndUpdate({
            username: socket.request.user.local.username
        }, {
            x: player.x,
            y: player.y
        }, (err, user) => {
            if (err) throw err;
        });
    }
    
    eachSocket(fn){
        return Object.keys(this.sockets).map(id => fn(this.sockets[id], id));
    }
    
    enterRoom(room, client){
        this.rooms[room].enter(client);
    }
    
    leaveRoom(room, client){
        this.rooms[room].leave(client);
    }
    
}

module.exports = Game;
