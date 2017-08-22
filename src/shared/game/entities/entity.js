'use strict';

const randomstring = require('randomstring');
const polygons = require('../systems/polygons');

class Entity {
    
    static generateId(len = 8){
        return randomstring.generate(len); //String(Math.round(Math.random() * Math.pow(10, 8)));
    }
    
    constructor(GAME, room, x = 0, y = 0, width = 0, height = 0, hitboxes = {}){
        this.GAME = GAME;
        this.room = room;
        this.type = this.constructor.name;
        this.x = x; //left
        this.y = y; //top
        this.hspeed = 0;
        this.vspeed = 0;
        this.width = width;
        this.height = height;
        this.hitboxes = Object.assign({}, hitboxes, {
            "default": new polygons.Rectangle([x, y], 0, 0, width, height)
        });
        this.activeHitbox = 'default';
        this.id = this.constructor.generateId();
        //this.constructor.instances[this.id] = this;
        this.exists = true;
        this.types = this.types ? this.type.concat(['Entity']) : ['Entity'];
        this.timers = {};
    }
    
    get hitbox(){
        return this.hitboxes[this.activeHitbox];
    }
    
    get hitboxPoints(){
        return this.hitbox.calcPoints.map(vector => [vector.x, vector.y]);
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
        this.updateTimers();
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
        this.hitbox.setOffset(new polygons.Vector(this.x, this.y));
    }
    
    updateTimers(){
        Object.keys(this.timers).forEach(name => {
            let timer = this.timers[name];
            if (!timer.count){
                timer.action();
                delete this.timers[name];
            }
            timer.count --;
        });
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
        return this.hitbox.isTouching(entity.hitbox);
    }
    
    setTimer(name, fn, steps){
        this.timers[name] = {
            name: name,
            action: fn,
            count: steps
        };
    }
    
}

Entity.clientFormat = ['types', 'x', 'y', 'hspeed', 'vspeed', 'hitboxPoints'];

module.exports = Entity;
