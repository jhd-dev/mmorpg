'use strict';

var Entity = require('./entity');
var objectEach = require('../common/object-each');

class Enemy extends Entity {
    
    constructor(GAME, x = 0, y = 0, name = '', power = 0, aggroRange = Infinity, aggroSpeed = 1, accuracy = 1, foresight = 0){
        super(GAME, x, y);
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
            this.follow(this.target, this.aggroSpeed);
        } else {
            this.detectTarget();
        }
        objectEach(this.GAME.objects.Bullet.instances, bullet => {
            if (bullet.creator !== this && this.x < bullet.x + 16 && this.x + 16 > bullet.x && this.y < bullet.y + 16 && this.y + 16 > bullet.y){
                this.hp = Math.max(0, this.hp - 1);
                if (!this.hp){
                    this.destroy();
                }
                bullet.destroy();
            }
        });
    }
    
    detectTarget(){
        objectEach(this.GAME.objects.Player.instances, player => {
            if (!this.player && this.distanceTo(player) < this.aggroRange){
                this.target = player;
            }
        });
    }
    
}

Enemy.clientFormat = Entity.clientFormat.concat(['hp', 'maxHp', 'name']);

module.exports = Enemy;
