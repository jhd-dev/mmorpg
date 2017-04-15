'use strict';

var Entity = require('./entity');

class Bullet extends Entity {
    
    constructor(creator, angle){
        super();
        this.creator = creator;
        this.x = this.creator.x;
        this.y = this.creator.y;
        angle = Math.random() * 2 * Math.PI;
        this.hspeed = Math.cos(angle) * 5;
        this.vspeed = Math.sin(angle) * 5;
        this.id = Symbol();
        Bullet.list[this.id] = this;
        
        setTimeout(() => this.destroy(), 1000);
    }
    
}

Bullet.list = {};
Bullet.clientFormat = Entity.clientFormat;

module.exports = Bullet;