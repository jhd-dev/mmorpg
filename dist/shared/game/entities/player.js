'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entity = require('./entity');
var Inventory = require('../systems/inventory');
var rightKey = 68;
var upKey = 87;
var leftKey = 65;
var downKey = 83;

var Player = function (_Entity) {
    _inherits(Player, _Entity);

    _createClass(Player, null, [{
        key: 'disconnect',
        value: function disconnect(socket) {
            socket.player.destroy();
            delete Player.instances[socket.id];
        }
    }]);

    function Player(GAME, room) {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, GAME, room, 0, 0, 16, 16));

        _this.name = 'Guest' + String(Math.random()).substr(2, 4);
        _this.keys = new Array(300).fill(false);
        _this.color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
        _this.maxSpeed = 2;
        _this.maxHp = 10;
        _this.hp = _this.maxHp;
        _this.inventory = new Inventory(_this);
        _this.types.push('Player');
        return _this;
    }

    _createClass(Player, [{
        key: 'destroy',
        value: function destroy() {
            delete this.inventory;
            _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'update',
        value: function update() {
            var _this2 = this;

            this.updateSpeed();
            this.room.forEachInstance('Bullet', function (bullet) {
                if (bullet.creator !== _this2 && _this2.x < bullet.x + 16 && _this2.x + 16 > bullet.x && _this2.y < bullet.y + 16 && _this2.y + 16 > bullet.y) {
                    _this2.hp = Math.max(0, _this2.hp - 1);
                    bullet.destroy();
                }
            });
            this.room.forEachInstance('Enemy', function (enemy) {
                if (_this2.isTouching(enemy)) {
                    _this2.hp -= 0.1;
                }
            });
            if (this.hp <= 0) {
                this.hp = this.maxHp;
            }
            _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'update', this).call(this);
            console.log(this.hitbox.calcPoints);
        }
    }, {
        key: 'updateSpeed',
        value: function updateSpeed() {
            this.hspeed = this.maxSpeed * (this.keys[rightKey] - this.keys[leftKey]);
            this.vspeed = this.maxSpeed * (this.keys[downKey] - this.keys[upKey]);
        }
    }, {
        key: 'shootBullet',
        value: function shootBullet(x, y) {
            var bullet = this.room.create('Bullet', [this, Math.atan2(y - this.y, x - this.x)]);
            bullet.hspeed += this.hspeed;
            bullet.vspeed += this.vspeed;
        }
    }]);

    return Player;
}(Entity);

Player.clientFormat = Entity.clientFormat.concat(['name', 'color', 'hp', 'maxHp']);
module.exports = Player;