'use strict';

class Entity {
    
    static update(){
        return Object.keys(this.instances).map(id => {
            var entity = this.instances[id];
            entity.update();
            var clientEntity = {};
            this.clientFormat.forEach(key => {
                clientEntity[key] = entity[key];
            });
            return clientEntity;
        });
    }
    
    static generateId(){
        var id;
        do {
            id = String(Math.round(Math.random() * Math.pow(10, 8)));
        } while (this.instances[id]);
        return id;
    }
    
    constructor(GAME, x = 0, y = 0){
        this.GAME = GAME;
        this.type = this.constructor.name;
        this.x = x;
        this.y = y;
        this.hspeed = 0;
        this.vspeed = 0;
        this.id = this.constructor.generateId();
        this.constructor.instances[this.id] = this;
    }
    
    destroy(){
        delete this.constructor.instances[this.id];
        //this.GAME.destroy(this);
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
