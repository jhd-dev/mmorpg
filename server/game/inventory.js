'use strict';

class Inventory {
    
    constructor(player){
        this.player = player;
        this.items = ['potion'];
        this.prevPack = {
            items: this.items
        };
    }
    
    getClientPack(){
        return {
            items: this.items.map(item => {
                return {
                    type: item
                };
            })
        };
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
        this.removeItemByIndex(index);
    }
    
    removeItemByType(type, amount = 1){
        for (var i = 0; i < amount; i ++){
            if (this.items.includes(type)){
                this.items.splice(this.items.indexOf(type), 1);
            }
        }
    }
    
    removeItemByIndex(index){
        this.items.splice(index, 1);
    }
    
    getData(){
        return {
            items: this.items
        };
    }
    
}

module.exports = Inventory;

