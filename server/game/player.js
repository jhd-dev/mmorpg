'use strict';

var Entity = require('./entity');

var rightKey = 68;
var upKey = 87;
var leftKey = 65;
var downKey = 83;

class Player extends Entity {
    
    static connect(socket){
        var player = this.GAME.create('Player', [socket.id]);
        
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
        console.log(id);
        console.log(Player.instances);
        Player.instances[id] = this;
    }
    
    update(){
        this.updateSpeed();
        super.update();
    }
    
    updateSpeed(){
        this.hspeed = this.maxSpeed * (this.keys[rightKey] - this.keys[leftKey]);
        this.vspeed = this.maxSpeed * (this.keys[downKey] - this.keys[upKey]);
    }
    
    shootBullet(x, y){
        var bullet = this.GAME.create('Bullet', [this, x, y]);
    }
    
}

Player.instances = {};
Player.clientFormat = Entity.clientFormat.concat(['name', 'color']);

module.exports = Player;