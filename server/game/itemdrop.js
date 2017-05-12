'use strict';

var Entity = require('./entity');

class ItemDrop extends Entity {
    
    constructor(GAME, x, y, type){
        super(GAME, x, y, 16, 16, 'rect');
        this.type = type;
    }
    
    update(){
        var closestPlayer = null;
        var closestDistance = Infinity;
        for (let player of this.GAME.objects.Player.instanceList){
            if (this.isTouching(player)){
                player.hp = Math.min(player.maxHp, player.hp + 4);
                return this.destroy();
            } else {
                var distance = this.distanceTo(player) - player.width / 2;
                if (distance < closestDistance){
                    closestPlayer = player;
                    closestDistance = distance;
                }
            }
        }
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
