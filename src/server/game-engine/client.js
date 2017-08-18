'use strict';

const User = require('../models/user');

class Client {
    
    constructor(socket, GAME){
        this.socket = socket;
        this.GAME = GAME;
        this.chatCommands = {
            pm (socket, recipient, message) { //console.log('pm');
                let recipientId = Object.keys(this.GAME.sockets).find(id => this.GAME.sockets[id].player.name === recipient);
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
    
    onConnect(){//console.log(this.GAME);
        this.player = this.GAME.create('Player', []);
        //console.log(player);
        this.id = this.player.id;
        //console.log(socket.request);
        if (this.socket.request.user.logged_in && this.socket.request.user.local){
            let user = this.socket.request.user;
            this.player.name = user.local.username;
            this.player.x = user.x;
            this.player.y = user.y;
            this.player.zone = this.GAME.zones['grass'];
        } else {
            this.player.name = 'Guest' + Math.floor(Math.random() * Math.pow(10, 5));
            this.player.zone = this.GAME.zones['grass'];
        }
        this.player.zone.enter(this);
        this.socketEvents();
    }
    
    onDisconnect(){
        console.log('removed socket');
        if (this.socket.request.user){
            this.saveUser();
        }
        this.player.room.leave(this);
    }
    
    socketEvents(){console.log('events');
        this.socket.on('disconnect', () => this.onDisconnect());
        
        this.socket.on('chatMsg', () => this.onChatMsg());
        
        this.socket.on('clientDebug', data => {
            console.log(data);
        });
        
        this.socket.on('keyDown', data => {
            this.player.keys[data.key] = true;
        });
        
        this.socket.on('keyUp', data => {
            this.player.keys[data.key] = false;
        });
        
        this.socket.on('click', data => {
            this.player.shootBullet(data.x, data.y);
        });
    }
    
    saveUser(){
        User.findOneAndUpdate({
            username: this.socket.request.user.local.username
        }, {
            x: this.player.x,
            y: this.player.y
        }, (err, user) => {
            if (err) throw err;
        });
    }
    
    sendInitPack(data){
        this.socket.emit('init', data);
    }
    
    sendUpdate(data){
        this.socket.emit('update', data);
    }
    
    onChatMsg(data){
        if (data.charAt(0) === '/'){
            let inputs = data.substr(1).split(' '); console.log(inputs);
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
