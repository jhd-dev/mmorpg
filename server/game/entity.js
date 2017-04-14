'use strict';

class Entity {
    
    static update(){
        return Object.getOwnPropertySymbols(this.instances).map(id => {
            var entity = this.instances[id];
            entity.update();
            var clientEntity = {};
            this.clientFormat.forEach(key => {
                clientEntity[key] = entity[key];
            });
            return clientEntity;
        });
    }
    
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

Entity.instances = {};
Entity.clientFormat = ['x', 'y', 'hspeed', 'vspeed'];

module.exports = Entity;
