'use strict';

var Entity = require('./entity');
var Inventory = require('./inventory');

var rightKey = 68;
var upKey = 87;
var leftKey = 65;
var downKey = 83;

class Player extends Entity {
    
    static connect(socket){
        var player = this.GAME.create('Player');
        
        socket.on('keyDown', function(data){//console.log(data.key);
            player.keys[data.key] = true;
        });
        
        socket.on('keyUp', function(data){
            player.keys[data.key] = false;
        });
        
        socket.on('click', function(data){
            player.shootBullet(data.x, data.y);
        });
        
        return player;
    }
    
    static disconnect(socket){
        delete Player.instances[socket.id];
        socket.player.destroy();
    }
    
    constructor(GAME){
        super(GAME, 0, 0, 16, 16, 'rect');
        this.name = 'Guest' + String(Math.random()).substr(2, 4);
        this.keys = new Array(300).fill(false);
        this.color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
        this.maxSpeed = 2;
        this.maxHp = 10;
        this.hp = this.maxHp;
        this.inventory = new Inventory(this);
    }
    
    destroy(){
        delete this.inventory;
        super.destroy();
    }
    
    update(){
        this.updateSpeed();
        Object.keys(this.GAME.objects.Bullet.instances).forEach(bulletId => {
            var bullet = this.GAME.objects.Bullet.instances[bulletId];
            if (bullet.creator !== this && this.x < bullet.x + 16 && this.x + 16 > bullet.x && this.y < bullet.y + 16 && this.y + 16 > bullet.y){
                this.hp = Math.max(0, this.hp - 1);
                bullet.destroy();
            }
        });
        this.GAME.objects.Enemy.instanceList.forEach(enemy => {
            if (this.isTouching(enemy)){
                this.hp -= 0.1;
            }
        });
        if (this.hp <= 0){
            this.hp = this.maxHp;
        }
        super.update();
    }
    
    updateSpeed(){
        this.hspeed = this.maxSpeed * (this.keys[rightKey] - this.keys[leftKey]);
        this.vspeed = this.maxSpeed * (this.keys[downKey] - this.keys[upKey]);
    }
    
    shootBullet(x, y){
        var bullet = this.GAME.create('Bullet', [this, Math.atan2(y - this.y, x - this.x)]);
        bullet.hspeed += this.hspeed;
        bullet.vspeed += this.vspeed;
    }
    
}

Player.clientFormat = Entity.clientFormat.concat(['name', 'color', 'hp', 'maxHp']);

module.exports = Player;
