'use strict';

var Entity = require('./entity');

class Player extends Entity {
    
    static connect(socket){
        var player = new Player(socket.id);
        
        socket.on('keyDown', function(data){//console.log(data.key);
            player.keys[data.key] = true;
        });
        
        socket.on('keyUp', function(data){
            player.keys[data.key] = false;
        });
    }
    
    static disconnect(socket){
        delete Player.list[socket.id];
    }
    
    static update(){
        return Object.getOwnPropertySymbols(Player.list).map(id => {
            var player = Player.list[id];
            player.update();
            return {
                name: player.name,
                x: player.x,
                y: player.y,
                hspeed: player.hspeed,
                vspeed: player.vspeed,
                color: player.color
            };
        });
    }
    
    constructor(id){
        super();
        this.name = 'Guest' + String(Math.random()).substr(2, 4);
        this.keys = new Array(300).fill(false);
        this.color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
        this.maxSpeed = 2;
        Player.list[id] = this;
    }
    
    update(){
        this.updateSpeed();
        super.update();
    }
    
    updateSpeed(){
        this.hspeed = this.maxSpeed * (this.keys[39] - this.keys[37]);
        this.vspeed = this.maxSpeed * (this.keys[40] - this.keys[38]);
    }
    
    shootBullet(){
        
    }
    
}

Player.list = {};

module.exports = Player;
