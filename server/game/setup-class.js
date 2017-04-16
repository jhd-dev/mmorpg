'use strict';

function setupGameClass (GAME, ogClass){
    
    var GameObject = class extends ogClass {
        
        constructor(){
            super(...Array.prototype.slice.call(arguments));
            GameObject.instances[this.id] = this;
            this.type = super.constructor.name;
            this.GAME = GAME;
            do {
                this.id = String(Math.round(Math.random() * Math.pow(10, 8)));
            } while (GAME.gameClasses[this.type].instances[this.id]);
            //console.log(this.type);
            //console.log(this.GAME);
        }
        
    };
    
    GameObject.GAME = GAME;
    return GameObject;
    
}

module.exports = setupGameClass;
