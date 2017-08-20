'use strict';

const Entity = require('./entity');

class Bullet extends Entity {
    
    constructor(GAME, room, creator, angle, width = 16, height = 16, shape = 'rectangle'){
        super(GAME, room, creator.x, creator.y, width, height, shape);
        this.types.push('Bullet');
        this.creator = creator;
        this.hspeed = Math.cos(angle) * 5;
        this.vspeed = Math.sin(angle) * 5;
        this.setTimer('expire', () => this.destroy(), 60);
    }
    
    update(){
        super.update();
        let enemy1 = this.room.entities.Enemy[Object.keys(this.room.entities.Enemy)[0]];
        console.log(Math.hypot(this.hitbox.offset.x - enemy1.hitbox.offset.x, this.hitbox.offset.y - enemy1.hitbox.offset.y));
    }
    
}

Bullet.clientFormat = Entity.clientFormat;

module.exports = Bullet;
