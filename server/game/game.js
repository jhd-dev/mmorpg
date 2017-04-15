'use strict';

var setupGameClass = require('./setup-class');

var Game = {
        
    init: (gameClassNames) => {
        Game.gameClasses = {};
        gameClassNames.forEach(gameClass => {
            if (typeof gameClass === 'string'){
                Game.gameClasses[gameClass] = setupGameClass(Game, require('./' + gameClass.toLowerCase()));
            } else if (typeof gameClass === 'function'){
                console.log('function');
                Game.gameClasses[gameClass] = gameClass;
            }
        });
        return Game;
    },
    
    connect: (socket) => {
        return Game.gameClasses.Player.connect(socket);
    },
    
    disconnect: (socket) => {
        return Game.gameClasses.Player.disconnect(socket);
    },
    
    update: () => {
        var pack = {};
        Object.keys(Game.gameClasses).forEach(className => {
            pack[className] = Game.gameClasses[className].update();
        });
        return pack;
    },
    
    create: (className, args) => {
        return new Game.gameClasses[className](...args);
    }
    
};

module.exports = Game;
