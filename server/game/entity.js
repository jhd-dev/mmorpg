'use strict';

class Entity {
    
    static update(){
        var instances = {};
        Object.keys(this.instances).forEach(id => {
            var entity = this.instances[id];
            entity.update();
            var clientEntity = {};
            this.clientFormat.forEach(key => {
                clientEntity[key] = entity[key];
            });
            instances[id] = clientEntity;
        });
        return instances;
    }
    
    static getClientPack(){
        var instances = {};
        Object.keys(this.instances).forEach(id => {
            var entity = this.instances[id];
            var clientEntity = {};
            this.clientFormat.forEach(key => {
                clientEntity[key] = entity[key];
            });
            instances[id] = clientEntity;
        });
        return instances;
    }
    
    static generateId(){
        var id;
        do {
            id = String(Math.round(Math.random() * Math.pow(10, 8)));
        } while (this.instances[id]);
        return id;
    }
    
    static each(callback){
        return Object.keys(this.instances).map((id, i, arr) => callback(this.instances[id], id, arr));
    }
    
    static get instanceList(){
        return Object.keys(this.instances).map(id => this.instances[id]);
    }
    
    constructor(GAME, x = 0, y = 0, width = 0, height = 0, shape = 'rect'){
        this.GAME = GAME;
        this.type = this.constructor.name;
        this.x = x;
        this.y = y;
        this.hspeed = 0;
        this.vspeed = 0;
        this.width = width;
        this.height = height;
        this.shape = shape;
        this.id = this.constructor.generateId();
        this.constructor.instances[this.id] = this;
        this.exists = true;
    }
    
    destroy(){
        this.exists = false;
        delete this.constructor.instances[this.id];
        //this.GAME.destroy(this);
    }
    
    update(){
        this.updatePosition();
    }
    
    updatePosition(){
        this.x += this.hspeed;
        this.y += this.vspeed;
        if (this.hspeed === 0 && this.vspeed === 0){
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        }
    }
    
    distanceTo(entity){
        return Math.hypot(entity.x - this.x, entity.y - this.y);
    }
    
    angleTo(entity){
        return Math.atan2(entity.y - this.y, entity.x - this.x);
    }
    
    follow(entity, speed = 1){
        var angle = this.angleTo(entity);
        this.hspeed = Math.cos(angle) * speed;
        this.vspeed = Math.sin(angle) * speed;
    }
    
    isTouching(entity){
        if (this.shape === 'rect'){
            if (entity.shape === 'rect'){
                return this.x < entity.x + entity.width
                   && this.x + this.width > entity.x 
                   && this.y < entity.y + entity.height 
                   && this.height + this.y > entity.y;
            }
        } else if (this.shape === 'elipses'){
            
        } else {
            return false;
        }
    }
    
}

Entity.instances = {};
Entity.clientFormat = ['x', 'y', 'hspeed', 'vspeed'];

module.exports = Entity;
