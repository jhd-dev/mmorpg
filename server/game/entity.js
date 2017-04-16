'use strict';

class Entity {
    
    static update(){
        //console.log(this.instances);
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
    
    constructor(GAME, x = 0, y = 0){
        this.GAME = GAME;
        this.x = x;
        this.y = y;
        this.hspeed = 0;
        this.vspeed = 0;
    }
    
    destroy(){
        this.GAME.destroy(this);
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
