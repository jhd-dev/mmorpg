'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var randomstring = require('randomstring');
var polygons = require('../systems/polygons');

var Entity = function () {
    _createClass(Entity, null, [{
        key: 'generateId',
        value: function generateId() {
            var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;

            return randomstring.generate(len); //String(Math.round(Math.random() * Math.pow(10, 8)));
        }
    }]);

    function Entity(GAME, room) {
        var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var height = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var hitboxes = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

        _classCallCheck(this, Entity);

        this.GAME = GAME;
        this.room = room;
        this.type = this.constructor.name;
        this.x = x; //left
        this.y = y; //top
        this.hspeed = 0;
        this.vspeed = 0;
        this.width = width;
        this.height = height;
        this.hitboxes = Object.assign({}, hitboxes, {
            "default": new polygons.Rectangle([x, y], 0, 0, width, height)
        });
        this.activeHitbox = 'default';
        this.id = this.constructor.generateId();
        //this.constructor.instances[this.id] = this;
        this.exists = true;
        this.types = this.types ? this.type.concat(['Entity']) : ['Entity'];
        this.timers = {};
    }

    _createClass(Entity, [{
        key: 'destroy',
        value: function destroy() {
            this.exists = false;
            this.room.remove(this);
        }
    }, {
        key: 'on',
        value: function on(event, fn, params) {
            if (event === 'destroy') {}
        }
    }, {
        key: 'update',
        value: function update() {
            this.updatePosition();
            this.updateTimers();
        }
    }, {
        key: 'getClientPack',
        value: function getClientPack() {
            var _this = this;

            var pack = {};
            this.constructor.clientFormat.forEach(function (key) {
                pack[key] = _this[key];
            });
            return pack;
        }
    }, {
        key: 'updatePosition',
        value: function updatePosition() {
            this.x += this.hspeed;
            this.y += this.vspeed;
            if (this.hspeed === 0 && this.vspeed === 0) {
                this.x = Math.round(this.x);
                this.y = Math.round(this.y);
            }
            this.hitbox.setOffset(new polygons.Vector(this.x, this.y));
        }
    }, {
        key: 'updateTimers',
        value: function updateTimers() {
            var _this2 = this;

            Object.keys(this.timers).forEach(function (name) {
                var timer = _this2.timers[name];
                if (!timer.count) {
                    timer.action();
                    delete _this2.timers[name];
                }
                timer.count--;
            });
        }
    }, {
        key: 'distanceTo',
        value: function distanceTo(entity) {
            return Math.hypot(entity.x - this.x, entity.y - this.y);
        }
    }, {
        key: 'angleTo',
        value: function angleTo(entity) {
            return Math.atan2(entity.y - this.y, entity.x - this.x);
        }
    }, {
        key: 'follow',
        value: function follow(entity) {
            var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            var angle = this.angleTo(entity);
            if (this.distanceTo(entity) <= speed) {
                this.hspeed = entity.x - this.x;
                this.vspeed = entity.y - this.y;
            } else {
                this.hspeed = Math.cos(angle) * speed;
                this.vspeed = Math.sin(angle) * speed;
            }
        }
    }, {
        key: 'isTouching',
        value: function isTouching(entity) {
            return this.hitbox.isTouching(entity.hitbox);
        }
    }, {
        key: 'setTimer',
        value: function setTimer(name, fn, steps) {
            this.timers[name] = {
                name: name,
                action: fn,
                count: steps
            };
        }
    }, {
        key: 'hitbox',
        get: function get() {
            return this.hitboxes[this.activeHitbox];
        }
    }, {
        key: 'hitboxPoints',
        get: function get() {
            return this.hitbox.calcPoints.map(function (vector) {
                return [vector.x, vector.y];
            });
        }
    }]);

    return Entity;
}();

Entity.clientFormat = ['types', 'x', 'y', 'hspeed', 'vspeed', 'hitboxPoints'];
module.exports = Entity;