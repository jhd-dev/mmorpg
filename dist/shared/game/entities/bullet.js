'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entity = require('./entity');

var Bullet = function (_Entity) {
    _inherits(Bullet, _Entity);

    function Bullet(GAME, room, creator, angle) {
        var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 16;
        var height = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 16;

        _classCallCheck(this, Bullet);

        var _this = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, GAME, room, creator.x, creator.y, width, height));

        _this.types.push('Bullet');
        _this.creator = creator;
        _this.hspeed = Math.cos(angle) * 5;
        _this.vspeed = Math.sin(angle) * 5;
        _this.setTimer('expire', function () {
            return _this.destroy();
        }, 60);
        return _this;
    }

    _createClass(Bullet, [{
        key: 'update',
        value: function update() {
            _get(Bullet.prototype.__proto__ || Object.getPrototypeOf(Bullet.prototype), 'update', this).call(this);
            var enemy1 = this.room.entities.Enemy[Object.keys(this.room.entities.Enemy)[0]];
            console.log(Math.hypot(this.hitbox.offset.x - enemy1.hitbox.offset.x, this.hitbox.offset.y - enemy1.hitbox.offset.y));
        }
    }]);

    return Bullet;
}(Entity);

Bullet.clientFormat = Entity.clientFormat;
module.exports = Bullet;