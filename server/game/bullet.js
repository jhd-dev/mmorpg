'use strict';

var Entity = require('./entity');

class Bullet extends Entity {
    
    constructor(GAME, creator, angle){
        super(GAME);
        this.creator = creator;
        this.x = this.creator.x;
        this.y = this.creator.y;
        //angle = Math.random() * 2 * Math.PI;
        this.hspeed = Math.cos(angle) * 5;
        this.vspeed = Math.sin(angle) * 5;
        //Bullet.list[this.id] = this;
        
        setTimeout(() => this.destroy(), 1000);
    }
    
}

Bullet.clientFormat = Entity.clientFormat;

module.exports = Bullet;
