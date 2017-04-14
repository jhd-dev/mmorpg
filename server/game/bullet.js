'use strict';

var Entity = require('./entity');

class Bullet extends Entity {
    
    constructor(angle){
        super();
        this.hspeed = Math.cos(angle) * 5;
        this.vspeed = Math.sin(angle) * 5;
    }
    
}

module.exports = Bullet;