'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tmxParser = require('tmx-parser');
var Room = require('./room');

var Zone = function () {
    function Zone(GAME, name, mapName, sprites) {
        var _this = this;

        _classCallCheck(this, Zone);

        this.GAME = GAME;
        this.name = name;
        this.mapName = mapName;
        this.sprites = sprites;
        this.rooms = [];
        this.getMap(function (err, map) {
            console.log(map);
            if (err) throw err;
            _this.map = map;
            _this.createRoom();
        });
    }

    _createClass(Zone, [{
        key: 'getMap',
        value: function getMap(callback) {
            /*$.ajax({
                url: mapDir + this.mapName + '.tmx',
                dataType: 'xml',
                error: callback,
                success: console.log
            })*/
            tmxParser.parseFile(this.GAME.mapDir + '/' + this.mapName + '.tmx', callback);
        }
    }, {
        key: 'prepare',
        value: function prepare(client) {
            client.sendPrepPack({
                sprites: this.sprites,
                mapName: this.mapName
            });
        }
    }, {
        key: 'enter',
        value: function enter(client) {
            this.rooms[0].enter(client);
        }
    }, {
        key: 'update',
        value: function update() {
            this.rooms.forEach(function (room) {
                return room.update();
            });
        }
    }, {
        key: 'sendUpdate',
        value: function sendUpdate() {
            this.rooms.forEach(function (room) {
                return room.sendUpdate();
            });
        }
    }, {
        key: 'create',
        value: function create(className) {
            var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            return new (Function.prototype.bind.apply(this.objects[className], [null].concat([this], _toConsumableArray(args))))();
        }
    }, {
        key: 'createRoom',
        value: function createRoom() {
            this.rooms.push(new Room(this.GAME, this, this.map, this.mapName));
        }
    }, {
        key: 'removeRoom',
        value: function removeRoom(id) {}
    }]);

    return Zone;
}();

module.exports = Zone;