'use strict';

class Client {
    
    constructor(socket, GAME){
        this.socket = socket;
        this.GAME = GAME;
        this.chatCommands = {
            pm: (socket, recipient, message) => { //console.log('pm');
                var recipientId = Object.keys(this.GAME.sockets).find(id => this.GAME.sockets[id].player.name === recipient);
                if (this.GAME.sockets[recipientId]){
                    this.GAME.sockets[recipientId].emit('chatMsg', {
                        name: socket.player.name,
                        msg: message,
                        type: 'private',
                        recipient: this.GAME.sockets[recipientId].player.name
                    });
                    socket.emit('chatMsg', {
                        name: socket.player.name,
                        msg: message,
                        type: 'private',
                        recipient: this.GAME.sockets[recipientId].player.name
                    });
                }
            }
        };
    }
    
    onConnect(){
        this.socket.zone;
        var player = this.GAME.connect(this.socket);
        //console.log(player);
        this.socket.id = player.id;
        this.GAME.sockets[this.socket.id] = this.socket;
        this.socket.player = player;
        //console.log(socket.request);
        if (this.socket.request.user.logged_in && this.socket.request.user.local){
            var user = this.socket.request.user;
            player.name = user.local.username;
            player.x = user.x;
            player.y = user.y;
            player.zone = this.GAME.zones['grass'];
        } else {
            player.name = 'Guest' + Math.floor(Math.random() * Math.pow(10, 5));
            player.zone = this.GAME.zones['grass'];
        }
        player.zone.enter(this);
        //this.socket.emit('init', this.socket.player.zone.getInitPack(this.socket));
    }
    
    onDisconnect(){
        console.log('removed socket');
        if (this.socket.request.user){
            this.GAME.saveUser(this.socket);
        }
        delete this.GAME.sockets[this.socket.id];
        this.GAME.disconnect(this.socket);
    }
    
    sendUpdate(data){
        this.socket.emit('update', data);
    }
    
    onChatMsg(data){
        if (data.charAt(0) === '/'){
            var inputs = data.substr(1).split(' '); console.log(inputs);
            if (this.chatCommands[inputs[0]]){
                this.chatCommands[inputs[0]].apply(null, [this.socket].concat(inputs.slice(1)));
            }
        } else {
            this.GAME.eachSocket(socket => {
                if (data.length > 0){
                    //console.log(GAME);
                    socket.emit('chatMsg', {
                        name: this.player.name,
                        msg: data,
                        type: 'normal'
                    });
                }
            });
        }
    }
    
}

module.exports = Client;
