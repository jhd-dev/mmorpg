'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entity = require('./entity');
//const objectEach = require('../common/object-each');

var Enemy = function (_Entity) {
    _inherits(Enemy, _Entity);

    function Enemy(GAME, room) {
        var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var name = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
        var power = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var aggroRange = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : Infinity;
        var aggroSpeed = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
        var accuracy = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;
        var foresight = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;

        _classCallCheck(this, Enemy);

        var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, GAME, room, x, y, 16, 16));

        _this.types.push('Enemy');
        _this.name = name;
        _this.power = power;
        _this.aggroRange = aggroRange;
        _this.aggroSpeed = aggroSpeed;
        _this.accuracy = accuracy;
        _this.foresight = foresight;
        _this.target = null;
        _this.maxHp = 10;
        _this.hp = _this.maxHp;
        return _this;
    }

    _createClass(Enemy, [{
        key: 'update',
        value: function update() {
            var _this2 = this;

            _get(Enemy.prototype.__proto__ || Object.getPrototypeOf(Enemy.prototype), 'update', this).call(this);
            if (this.target) {
                if (this.target.exists) {
                    this.follow(this.target, this.aggroSpeed);
                } else {
                    this.target = null;
                }
            } else {
                this.detectTarget();
            }
            this.room.forEachInstance('Bullet', function (bullet) {
                if (bullet.creator !== _this2 && _this2.isTouching(bullet)) {
                    _this2.hp = Math.max(0, _this2.hp - 1);
                    console.log(_this2.hp);
                    if (!_this2.hp) {
                        _this2.destroy();
                    }
                    bullet.destroy();
                }
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.room.create('ItemDrop', [this.x, this.y, 'potion']);
            _get(Enemy.prototype.__proto__ || Object.getPrototypeOf(Enemy.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'detectTarget',
        value: function detectTarget() {
            var _this3 = this;

            this.hspeed = 0;
            this.vspeed = 0;
            this.room.forEachInstance('Player', function (player) {
                if (!_this3.player && _this3.distanceTo(player) < _this3.aggroRange) {
                    _this3.target = player;
                }
            });
        }
    }]);

    return Enemy;
}(Entity);

Enemy.clientFormat = Entity.clientFormat.concat(['hp', 'maxHp', 'name']);
module.exports = Enemy;