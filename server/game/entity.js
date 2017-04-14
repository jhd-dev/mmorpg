'use strict';

class Entity {
    constructor(){
        this.x = 10;
        this.y = 10;
        this.hspeed = 0;
        this.vspeed = 0;
    }
    update(){
        this.updatePosition();
    }
    updatePosition(){
        this.x += this.hspeed;
        this.y += this.vspeed;
    }
}

module.exports = Entity;
