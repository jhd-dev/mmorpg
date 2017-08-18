'use strict';

const Entity = require('./entity');

class Bullet extends Entity {
    
    constructor(GAME, room, creator, angle, width = 16, height = 16, shape = 'elipses'){
        super(GAME, room, creator.x + Math.cos(angle) * width, creator.y + Math.sin(angle) * height, width, height, shape);
        this.types.push('Bullet');
        this.creator = creator;
        this.hspeed = Math.cos(angle) * 5;
        this.vspeed = Math.sin(angle) * 5;
        this.setTimer('expire', () => this.destroy(), 60);
    }
    
}

Bullet.clientFormat = Entity.clientFormat;

module.exports = Bullet;
