'use strict';

var Entity = require('./entity');
var Bullet = require('./bullet');

class Player extends Entity {
    
    static connect(socket){
        var player = new Player(socket.id);
        
        socket.on('keyDown', function(data){//console.log(data.key);
            player.keys[data.key] = true;
        });
        
        socket.on('keyUp', function(data){
            player.keys[data.key] = false;
        });
        
        socket.on('click', function(data){
            player.shootBullet(data.x, data.y);
        });
    }
    
    static disconnect(socket){
        delete Player.instances[socket.id];
    }
    
    constructor(id){
        super();
        this.name = 'Guest' + String(Math.random()).substr(2, 4);
        this.keys = new Array(300).fill(false);
        this.color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
        this.maxSpeed = 2;
        Player.instances[id] = this;
    }
    
    update(){
        this.updateSpeed();
        super.update();
    }
    
    updateSpeed(){
        this.hspeed = this.maxSpeed * (this.keys[39] - this.keys[37]);
        this.vspeed = this.maxSpeed * (this.keys[40] - this.keys[38]);
    }
    
    shootBullet(x, y){
        var bullet = new Bullet(this, Math.atan2(y, x));
    }
    
}

Player.instances = {};
Player.clientFormat = Entity.clientFormat.concat(['name', 'color']);

module.exports = Player;
