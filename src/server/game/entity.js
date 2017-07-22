'use strict';

class Entity {
    
    static generateId(){
        let id;
        do {
            id = String(Math.round(Math.random() * Math.pow(10, 8)));
        } while (this.instances[id]);
        return id;
    }
    
    constructor(GAME, room, x = 0, y = 0, width = 0, height = 0, shape = 'rect'){
        this.GAME = GAME;
        this.room = room;
        this.type = this.constructor.name;
        this.x = x; //left
        this.y = y; //top
        this.hspeed = 0;
        this.vspeed = 0;
        this.width = width;
        this.height = height;
        this.shape = shape;
        this.id = this.constructor.generateId();
        this.constructor.instances[this.id] = this;
        this.exists = true;
        this.types = ['Entity'];
        this.timers = {};
    }
    
    destroy(){
        this.exists = false;
        this.room.remove(this);
    }
    
    on(event, fn, params){
        if (event === 'destroy'){
            
        }
    }
    
    update(){
        this.updatePosition();
        Object.keys(this.timers).forEach(name => {
            let timer = this.timers[name];
            if (!timer.count){
                timer.action();
                delete this.timers[name];
            }
            timer.count --;
        });
    }
    
    getClientPack(){
        let pack = {};
        this.constructor.clientFormat.forEach(key => {
            pack[key] = this[key];
        });
        return pack;
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
        let angle = this.angleTo(entity);
        if (this.distanceTo(entity) <= speed){
            this.hspeed = entity.x - this.x;
            this.vspeed = entity.y - this.y;
        } else {
            this.hspeed = Math.cos(angle) * speed;
            this.vspeed = Math.sin(angle) * speed;
        }
        
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
    
    getPointOnEdge(h, v){ // -1, -1 = top-left; 0, 0 = center; 1, 1 = bottom-right;
        return [this.x + h * this.width / 2, this.y + v * this.height / 2];
    }
    
    setTimer(name, fn, steps){
        this.timers[name] = {
            name: name,
            action: fn,
            count: steps
        };
    }
    
}

Entity.clientFormat = ['types', 'x', 'y', 'hspeed', 'vspeed'];

module.exports = Entity;
