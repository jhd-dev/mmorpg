'use strict';

var setupGameClass = require('./setup-class');

var Game = {
        
    init: (gameClassNames) => {
        this.gameClasses = {};
        gameClassNames.forEach(gameClass => {
            if (typeof gameClass === 'string'){
                this.gameClasses[gameClass] = setupGameClass(Game, require('./' + gameClass.toLowerCase()));
            } else if (typeof gameClass === 'function'){
                console.log('function');
                this.gameClasses[gameClass] = gameClass;
            }
        });
        return Game;
    },
    
    connect: (socket) => {
        this.gameClasses.Player.connect(socket);
        //console.log(this.gameClasses.Player.GAME === this);
    },
    
    disconnect: (socket) => {
        this.gameClasses.Player.disconnect(socket);
    },
    
    update: () => {
        var pack = {};
        Object.keys(this.gameClasses).forEach(className => {
            pack[className] = this.gameClasses[className].update();
        });
        //if (pack.Player[0]){
            //console.log(pack.Player);
        //}
        return pack;
    },
    
    create: (className, args) => {
        return new this.gameClasses[className](...args);
    }
    
};

module.exports = Game;
