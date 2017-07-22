'use strict';

const Entity = require('./entity');

class Bullet extends Entity {
    
    constructor(GAME, room, creator, angle, width = 16, height = 16, shape = 'elipses'){
        super(GAME, room, creator.x, creator.y, width, height, shape);
        this.types.push('Bullet');
        this.creator = creator;
        //angle = Math.random() * 2 * Math.PI;
        this.hspeed = Math.cos(angle) * 5;
        this.vspeed = Math.sin(angle) * 5;
        //Bullet.list[this.id] = this;
        
        this.setTimer('expire', () => this.destroy(), 60);
    }
    
}

Bullet.clientFormat = Entity.clientFormat;

module.exports = Bullet;
