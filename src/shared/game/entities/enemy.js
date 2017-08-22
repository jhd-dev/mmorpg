'use strict';

const Entity = require('./entity');
//const objectEach = require('../common/object-each');

class Enemy extends Entity {
    
    constructor(GAME, room, x = 0, y = 0, name = '', power = 0, aggroRange = Infinity, aggroSpeed = 1, accuracy = 1, foresight = 0){
        super(GAME, room, x, y, 16, 16);
        this.types.push('Enemy');
        this.name = name;
        this.power = power;
        this.aggroRange = aggroRange;
        this.aggroSpeed = aggroSpeed;
        this.accuracy = accuracy;
        this.foresight = foresight;
        this.target = null;
        this.maxHp = 10;
        this.hp = this.maxHp;
    }
    
    update(){
        super.update();
        if (this.target){
            if (this.target.exists){
                this.follow(this.target, this.aggroSpeed);
            } else {
                this.target = null;
            }
        } else {
            this.detectTarget();
        }
        this.room.forEachInstance('Bullet', bullet => {
            if (bullet.creator !== this && this.isTouching(bullet)){
                this.hp = Math.max(0, this.hp - 1);console.log(this.hp);
                if (!this.hp){
                    this.destroy();
                }
                bullet.destroy();
            }
        });
    }
    
    destroy(){
        this.room.create('ItemDrop', [this.x, this.y, 'potion']);
        super.destroy();
    }
    
    detectTarget(){
        this.hspeed = 0;
        this.vspeed = 0;
        this.room.forEachInstance('Player', player => {
            if (!this.player && this.distanceTo(player) < this.aggroRange){
                this.target = player;
            }
        });
    }
    
}

Enemy.clientFormat = Entity.clientFormat.concat(['hp', 'maxHp', 'name']);

module.exports = Enemy;
