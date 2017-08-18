'use strict';

const Entity = require('./entity');
const Inventory = require('../systems/inventory');

const rightKey = 68;
const upKey = 87;
const leftKey = 65;
const downKey = 83;

class Player extends Entity {
    
    static disconnect(socket){
        socket.player.destroy();
        delete Player.instances[socket.id];
    }
    
    constructor(GAME, room){
        super(GAME, room, 0, 0, 16, 16, 'rect');
        this.name = 'Guest' + String(Math.random()).substr(2, 4);
        this.keys = new Array(300).fill(false);
        this.color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
        this.maxSpeed = 2;
        this.maxHp = 10;
        this.hp = this.maxHp;
        this.inventory = new Inventory(this);
        this.types.push('Player');
    }
    
    destroy(){
        delete this.inventory;
        super.destroy();
    }
    
    update(){
        this.updateSpeed();
        this.room.forEachInstance('Bullet', bullet => {
            if (bullet.creator !== this && this.x < bullet.x + 16 && this.x + 16 > bullet.x && this.y < bullet.y + 16 && this.y + 16 > bullet.y){
                this.hp = Math.max(0, this.hp - 1);
                bullet.destroy();
            }
        });
        this.room.forEachInstance('Enemy', enemy => {
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
        let bullet = this.room.create('Bullet', [this, Math.atan2(y - this.y, x - this.x)]);
        bullet.hspeed += this.hspeed;
        bullet.vspeed += this.vspeed;
    }
    
}

Player.clientFormat = Entity.clientFormat.concat(['name', 'color', 'hp', 'maxHp']);

module.exports = Player;
