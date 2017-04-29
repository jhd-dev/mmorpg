'use strict';

var Entity = require('./entity');

class Bullet extends Entity {
    
    constructor(GAME, creator, angle, width = 16, height = 16, shape = 'elipses'){
        super(GAME, creator.x, creator.y, width, height, shape);
        this.creator = creator;
        //angle = Math.random() * 2 * Math.PI;
        this.hspeed = Math.cos(angle) * 5;
        this.vspeed = Math.sin(angle) * 5;
        //Bullet.list[this.id] = this;
        
        setTimeout(() => this.destroy(), 1000);
    }
    
}

Bullet.clientFormat = Entity.clientFormat;

module.exports = Bullet;
