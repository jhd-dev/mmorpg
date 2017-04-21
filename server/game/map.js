'use strict';

class Map {
    
    constructor(name, grid, tileSize){
        this.name = name;
        this.grid = grid;
        this.width = this.grid[0].length * tileSize;
        this.height = this.grid.length * tileSize;
    }
    
    detectPointCollision(){
        
    }
    
}

module.exports = Map;
