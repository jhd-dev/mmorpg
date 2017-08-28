'use strict';

module.exports = {
    fps: 50,
    mapDir: __dirname + '/maps',
    objects: {
        "Entity": __dirname + '/entities/entity.js',
        "Player": __dirname + '/entities/player.js',
        "Enemy": __dirname + '/entities/enemy.js',
        "Bullet": __dirname + '/entities/bullet.js',
        "ItemDrop": __dirname + '/entities/item-drop.js',
    },
    zones: {
        "grass": {
            mapName: 'map1',
            dir: __dirname + '/maps/map1.tmx',
            sprites: {}
        }
    }
};
