'use strict';

class Room {
    
    constructor(tilemap){
        this.players = {};
        this.tilemap = tilemap;
        this.width = tilemap[0].length;
        this.height = tilemap.length;
    }
    
}

module.exports = Room;
