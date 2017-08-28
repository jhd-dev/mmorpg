'use strict';
/**
 * A room to hold and manage a set of entities, keeping connected clients updated too
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Room = function () {
    function Room(GAME, zone, map, mapName) {
        var _this = this;

        _classCallCheck(this, Room);

        this.id = String(Math.random());
        this.GAME = GAME;
        this.objects = this.GAME.objects;
        this.zone = zone;
        this.map = map;
        this.width = map.width;
        this.height = map.height;
        this.clients = {};
        this.entities = { Entity: {} };
        Object.keys(this.objects).forEach(function (className) {
            _this.entities[className] = {};
        });
        this.prevPack = {
            entities: {}
        };
        this.removed = [];
        this.enemySpawnCounter = 0;
        var test = this.create('Enemy', [Math.random() * this.width, Math.random() * this.height, 'Evil Monster', 10, 180]);
    }

    _createClass(Room, [{
        key: 'enter',
        value: function enter(client) {
            this.clients[client.id] = client;
            this.addEntity(client.player);
            client.player.room = this;
            client.sendInitPack(this.getInitPack(client));
        }
    }, {
        key: 'leave',
        value: function leave(client) {
            client.player.destroy();
            delete this.clients[client.id];
        }
    }, {
        key: 'getInitPack',
        value: function getInitPack(client) {
            var _this2 = this;

            var entities = {};
            Object.keys(this.entities.Entity).forEach(function (id) {
                entities[id] = _this2.entities.Entity[id].getClientPack();
            });
            return {
                entities: entities,
                clientId: client.player.id,
                map: this.mapName
            };
        }
    }, {
        key: 'update',
        value: function update() {
            var _this3 = this;

            if (this.enemySpawnCounter % (7000 / 20) === 0 && Object.keys(this.entities.Enemy).length < 3 && Object.keys(this.entities.Player).length) {
                this.create('Enemy', [Math.random() * this.width, Math.random() * this.height, 'Evil Monster', 10, 180]);
            }
            this.enemySpawnCounter++;
            var prevPack = this.prevPack;
            var newPack = {
                entities: {}
            };
            var updatePack = {
                entities: {},
                removed: this.removed.slice()
            };
            this.removed = [];
            //Object.keys(this.entities).forEach(className => {//console.log(className);
            newPack.entities = {}; //console.log('this.entities',this.entities,'this.entities',this.entities);
            Object.keys(this.entities.Entity).forEach(function (id) {
                if (_this3.entities.Entity[id]) {
                    _this3.entities.Entity[id].update();
                    if (_this3.entities.Entity[id]) {
                        newPack.entities[id] = _this3.entities.Entity[id].getClientPack();
                    }
                }
            });
            //console.log(newPack);
            if (!prevPack.entities) {
                prevPack.entities = {};
            }
            Object.keys(prevPack.entities).forEach(function (id) {
                var changed = false;
                if (newPack.entities[id]) {
                    for (var key in prevPack.entities[id]) {
                        if (prevPack.entities[id][key] !== newPack.entities[id][key]) {
                            changed = true; //console.log(`new ${key}: ${newPack.entities[id][key]}, old: ${prevPack.entities[id][key]}`);
                            if (!updatePack.entities) {
                                //updatePack.entities = {};
                            }
                            if (!updatePack.entities[id]) {
                                updatePack.entities[id] = {};
                            }
                            updatePack.entities[id][key] = newPack.entities[id][key]; //console.log(updatePack.entities[id][key]);
                        }
                        //if (changed) console.log(updatePack.entities);
                    }
                    //console.log(updatePack.entities);
                }
                //if (changed) console.log(updatePack.entities);
            });
            Object.keys(newPack.entities).forEach(function (id) {
                if (!prevPack.entities[id]) {
                    if (!updatePack.entities) {
                        updatePack.entities = {};
                    }
                    updatePack.entities[id] = newPack.entities[id];
                }
            });
            //});
            //console.log(updatePack);
            this.updatePack = updatePack;
            this.prevPack = newPack;
        }
    }, {
        key: 'sendUpdate',
        value: function sendUpdate() {
            var _this4 = this;

            if (Object.keys(this.updatePack.entities).length) {
                Object.keys(this.clients).forEach(function (clientId) {
                    var client = _this4.clients[clientId];
                    //this.updatePack.inventory = socket.player.inventory.getClientPack(); console.log(socket.player);
                    client.sendUpdate(_this4.updatePack);
                });
            }
        }
    }, {
        key: 'create',
        value: function create(type) {
            var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var entity = this.GAME.create(type, this, args);
            this.addEntity(entity);
            return entity;
        }
    }, {
        key: 'addEntity',
        value: function addEntity(entity) {
            var _this5 = this;

            entity.types.forEach(function (type) {
                console.log(type);
                _this5.entities[type] = _this5.entities[type] || {};
                _this5.entities[type][entity.id] = entity;
            });
        }
    }, {
        key: 'remove',
        value: function remove(entity) {
            var _this6 = this;

            this.removed.push({
                types: entity.types,
                id: entity.id
            });
            entity.types.forEach(function (type) {
                delete _this6.entities[type][entity.id];
            });
        }
    }, {
        key: 'removeRoom',
        value: function removeRoom() {
            this.zone.removeRoom(this.id);
        }
    }, {
        key: 'detectPointCollision',
        value: function detectPointCollision(x, y) {
            var gridX = Math.floor(x / this.tileSize);
            var gridY = Math.floor(y / this.tileSize);
            if (this.grid[gridY]) {
                if (typeof this.grid[gridY][gridX] !== 'undefined') {
                    return this.grid[gridY][gridX];
                }
                return true;
            }
            return true;
        }
    }, {
        key: 'checkSpecialTiles',
        value: function checkSpecialTiles(entity) {}
    }, {
        key: 'forEachInstance',
        value: function forEachInstance(type, fn) {
            var _this7 = this;

            return Object.keys(this.entities[type]).map(function (instanceId, i, arr) {
                return fn(_this7.entities[type][instanceId], i, arr);
            });
        }
    }, {
        key: 'forEachClient',
        value: function forEachClient(fn) {
            var _this8 = this;

            var exception = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return Object.keys(this.clients).map(function (id, i, arr) {
                return fn(_this8.clients[id], i, arr);
            });
        }
    }]);

    return Room;
}();

module.exports = Room;