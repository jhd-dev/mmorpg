'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = require('../models/user');

var Client = function () {
    function Client(socket, GAME) {
        _classCallCheck(this, Client);

        this.socket = socket;
        this.GAME = GAME;
        this.chatCommands = {
            pm: function pm(socket, recipient, message) {
                var _this = this;

                var recipientId = Object.keys(this.GAME.sockets).find(function (id) {
                    return _this.GAME.sockets[id].player.name === recipient;
                });
                if (this.GAME.sockets[recipientId]) {
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

    _createClass(Client, [{
        key: 'onConnect',
        value: function onConnect() {
            this.player = this.GAME.create('Player', []);
            //console.log(player);
            this.id = this.player.id;
            //console.log(socket.request);
            if (this.socket.request.user.logged_in && this.socket.request.user.local) {
                var user = this.socket.request.user;
                this.player.name = user.local.username;
                this.player.x = user.x;
                this.player.y = user.y;
                this.player.zone = this.GAME.zones['grass'];
            } else {
                this.player.name = 'Guest' + Math.floor(Math.random() * Math.pow(10, 5));
                this.player.zone = this.GAME.zones['grass'];
            }
            this.player.zone.prepare(this);
            this.socketEvents();
        }
    }, {
        key: 'onDisconnect',
        value: function onDisconnect() {
            console.log('removed socket');
            if (this.socket.request.user) {
                this.saveUser();
            }
            console.log(this.player);
            this.player.room.leave(this);
        }
    }, {
        key: 'socketEvents',
        value: function socketEvents() {
            var _this2 = this;

            console.log('events');
            this.socket.on('disconnect', function () {
                return _this2.onDisconnect();
            });
            this.socket.on('prepComplete', function () {
                return _this2.onPrepComplete();
            });
            this.socket.on('chatMsg', function (data) {
                return _this2.onChatMsg(data);
            });
            this.socket.on('clientDebug', function (data) {
                console.log(data);
            });
            this.socket.on('keyDown', function (data) {
                _this2.player.keys[data.key] = true;
            });
            this.socket.on('keyUp', function (data) {
                _this2.player.keys[data.key] = false;
            });
            this.socket.on('click', function (data) {
                _this2.player.shootBullet(data.x, data.y);
            });
        }
    }, {
        key: 'saveUser',
        value: function saveUser() {
            User.findOneAndUpdate({
                username: this.socket.request.user.local.username
            }, {
                x: this.player.x,
                y: this.player.y
            }, function (err, user) {
                if (err) throw err;
            });
        }
    }, {
        key: 'sendPrepPack',
        value: function sendPrepPack(data) {
            this.socket.emit('prep', data);
        }
    }, {
        key: 'onPrepComplete',
        value: function onPrepComplete() {
            this.player.zone.enter(this);
        }
    }, {
        key: 'sendInitPack',
        value: function sendInitPack(data) {
            this.socket.emit('init', data);
        }
    }, {
        key: 'sendUpdate',
        value: function sendUpdate(data) {
            this.socket.emit('update', data);
        }
    }, {
        key: 'onChatMsg',
        value: function onChatMsg(data) {
            var _this3 = this;

            var message = data.message;
            if (message.charAt(0) === '/') {
                var inputs = data.substr(1).split(' ');
                console.log(inputs);
                if (this.chatCommands[inputs[0]]) {
                    this.chatCommands[inputs[0]].apply(null, [this.socket].concat(inputs.slice(1)));
                }
            } else {
                if (message.length > 0) {
                    this.player.room.forEachClient(function (client) {
                        return client.recieveChatMessage(_this3.player.name, message, 'normal');
                    });
                }
            }
        }
    }, {
        key: 'recieveChatMessage',
        value: function recieveChatMessage(name, message, type) {
            this.socket.emit('chatMsg', {
                name: name,
                msg: message,
                type: type
            });
        }
    }]);

    return Client;
}();

module.exports = Client;