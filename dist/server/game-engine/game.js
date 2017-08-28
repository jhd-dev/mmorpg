'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = require('./client');
var Zone = require('./zone');

var Game = function () {
    function Game(input) {
        var _this = this;

        _classCallCheck(this, Game);

        this.fps = input.fps;
        this.mapDir = input.mapDir;
        this.objects = {};
        Object.keys(input.objects).forEach(function (className) {
            return _this.addGameObject(className, input.objects[className]);
        });
        //console.log(this.objects);
        this.zones = {};
        Object.keys(input.zones).forEach(function (zoneName) {
            _this.zones[zoneName] = new Zone(_this, zoneName, input.zones[zoneName].mapName, input.zones[zoneName].sprites);
        });
        this.updateInterval = null;
    }

    _createClass(Game, [{
        key: 'addGameObject',
        value: function addGameObject(className, pathToClass) {
            this.objects[className] = require(pathToClass);
            this.objects[className].GAME = this;
        }
    }, {
        key: 'start',
        value: function start() {
            var _this2 = this;

            var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.fps;

            this.updateInterval = setInterval(function () {
                _this2.update();
                _this2.sendUpdate();
            }, 1000 / fps);
        }
    }, {
        key: 'stop',
        value: function stop() {
            clearInterval(this.updateInterval);
        }
    }, {
        key: 'onConnect',
        value: function onConnect(socket) {
            var client = new Client(socket, this);
            client.onConnect();
        }
    }, {
        key: 'update',
        value: function update() {
            var _this3 = this;

            Object.keys(this.zones).forEach(function (zoneName) {
                _this3.zones[zoneName].update();
            });
        }
    }, {
        key: 'sendUpdate',
        value: function sendUpdate() {
            var _this4 = this;

            Object.keys(this.zones).forEach(function (zoneName) {
                _this4.zones[zoneName].sendUpdate();
            });
        }
    }, {
        key: 'create',
        value: function create(type, room) {
            var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            return new (Function.prototype.bind.apply(this.objects[type], [null].concat([this, room], _toConsumableArray(args))))();
        }
    }]);

    return Game;
}();

module.exports = Game;