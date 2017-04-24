'use strict';

class Map {
    
    constructor(name, grid, tileSize){
        this.name = name;
        this.grid = grid;
        this.width = this.grid[0].length * tileSize;
        this.height = this.grid.length * tileSize;
        this.tileSize = tileSize;
    }
    
    detectPointCollision(x, y){
        var gridX = Math.floor(x / this.tileSize);
        var gridY = Math.floor(y / this.tileSize);
        if (this.grid[gridY]){
            if (typeof this.grid[gridY][gridX] !== 'undefined'){
                return this.grid[gridY][gridX];
            }
            return true;
        }
        return true;
    }
    
}

module.exports = Map;
