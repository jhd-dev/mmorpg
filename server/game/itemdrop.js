'use strict';

var Entity = require('./entity');

class ItemDrop extends Entity {
    
    constructor(GAME, x, y, type){
        super(GAME, x, y, 32, 32, 'rect');
        this.type = type;
    }
    
    update(){
        var closestPlayer = null;
        var closestDistance = Infinity;
        for (let player of this.GAME.objects.Player.instanceList){
            if (this.isTouching(player)){
                player.hp = Math.min(player.maxHp, player.hp + 4);
                this.destroy();
            } else {
                var distance = this.distanceTo(player);console.log(distance);
                if (distance < closestDistance){
                    closestPlayer = player;
                    closestDistance = distance;
                }
            }
        };
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
