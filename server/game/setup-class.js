'use strict';

function setupGameClass (GAME, ogClass){
    
    var GameObject = class extends ogClass {
        
        constructor(){
            super(...Array.prototype.slice.call(arguments));
            GameObject.instances[this.id] = this;
            this.type = super.constructor.name;
            this.GAME = GAME;
            //console.log(this.type);
            //console.log(this.GAME);
        }
        
        destroy(){
            super.destroy();
            delete GameObject.instances[this.id];
        }
        
    };
    
    //GameObject.instances = {};
    GameObject.GAME = GAME;
    //console.log(new GameObject());
    return GameObject;
    
}

module.exports = setupGameClass;
