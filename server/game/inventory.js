'use strict';

class Inventory {
    
    constructor(player){
        this.player = player;
        this.items = [];
    }
    
    addItem(type, amount = 1){
        this.items.push({
            type: type
        });
    }
    
    useItem(index){
        var item = this.items[index];
        if (item.type === 'potion'){
            this.player.hp = Math.min(this.player.hp + 5, this.player.maxHp);
        }
    }
    
    removeItem(type, amount = 1){
        
    }
    
    getData(){
        return {
            items: this.items
        };
    }
    
}

module.exports = Inventory;

