'use strict';

const Entity = require('./entity');

class ItemDrop extends Entity {
    
    constructor(GAME, room, x, y, item){
        super(GAME, room, x, y, 16, 16, 'rect');
        this.item = item;
        this.types.push('ItemDrop');
    }
    
    update(){
        let closestPlayer = null;
        let closestDistance = Infinity;
        this.room.forEachInstance('Player', player => {
            if (this.isTouching(player)){
                player.hp = Math.min(player.maxHp, player.hp + 4);
                return this.destroy();
            } else {
                let distance = this.distanceTo(player) - player.width / 2;
                if (distance < closestDistance){
                    closestPlayer = player;
                    closestDistance = distance;
                }
            }
        });
        if (closestDistance < 50){
            this.follow(closestPlayer, Math.min(3 * Math.pow(closestDistance, -0.5)), closestDistance);
        } else {
            this.hspeed = 0;
            this.vspeed = 0;
        }
        super.update();
    }
    
}

module.exports = ItemDrop;
