'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SAT = require('sat');

var Polygon = function (_SAT$Polygon) {
    _inherits(Polygon, _SAT$Polygon);

    function Polygon(pos, points) {
        _classCallCheck(this, Polygon);

        return _possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this, new (Function.prototype.bind.apply(SAT.V, [null].concat(_toConsumableArray(pos))))(), points.map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            return new SAT.V(x, y);
        })));
    }

    _createClass(Polygon, [{
        key: 'testCollision',
        value: function testCollision(polygon) {
            var response = new SAT.Response();
            return {
                collided: SAT.testPolygonPolygon(this, polygon, response),
                response: response
            };
        }
    }, {
        key: 'isTouching',
        value: function isTouching(polygon) {
            return this.testCollision(polygon).collided;
        }
    }, {
        key: 'boundingBox',
        get: function get() {
            var x = this.points.reduce(function (acc, cur) {
                return Math.min(acc, cur.x);
            }, Infinity);
            var y = this.points.reduce(function (acc, cur) {
                return Math.min(acc, cur.y);
            }, Infinity);
            var width = this.points.reduce(function (acc, cur) {
                return Math.max(acc, cur.x);
            }, -Infinity) - x;
            var height = this.points.reduce(function (acc, cur) {
                return Math.max(acc, cur.y);
            }, -Infinity) - y;
            return new Rectangle([this.x, this.y], x, y, width, height);
        }
    }]);

    return Polygon;
}(SAT.Polygon);

var Rectangle = function (_Polygon) {
    _inherits(Rectangle, _Polygon);

    function Rectangle(pos, x, y, width, height) {
        _classCallCheck(this, Rectangle);

        return _possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this, pos, [[x, y], [x + width, y], [x + width, y + height], [x, y + height]]));
    }

    _createClass(Rectangle, [{
        key: 'getPointOnEdge',
        value: function getPointOnEdge(h, v) {
            return [this.x + h * this.width / 2, this.y + v * this.height / 2];
        }
    }]);

    return Rectangle;
}(Polygon);

var Ellipse = function (_Polygon2) {
    _inherits(Ellipse, _Polygon2);

    function Ellipse(pos, x, y, xRadius, yRadius) {
        var accuracy = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;

        _classCallCheck(this, Ellipse);

        var points = [];
        for (var i = 0; i < accuracy; i++) {
            var angle = 2 * i * Math.PI / accuracy;
            points[i] = [x + xRadius * Math.cos(angle), y + yRadius * Math.sin(angle)];
        }
        return _possibleConstructorReturn(this, (Ellipse.__proto__ || Object.getPrototypeOf(Ellipse)).call(this, pos, points));
    }

    return Ellipse;
}(Polygon);

var Square = function (_Rectangle) {
    _inherits(Square, _Rectangle);

    function Square(pos, x, y, s) {
        _classCallCheck(this, Square);

        return _possibleConstructorReturn(this, (Square.__proto__ || Object.getPrototypeOf(Square)).call(this, pos, x, y, s, s));
    }

    return Square;
}(Rectangle);

var Circle = function (_Ellipse) {
    _inherits(Circle, _Ellipse);

    function Circle(pos, x, y, radius) {
        var accuracy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 5;

        _classCallCheck(this, Circle);

        return _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, pos, x, y, radius, radius, accuracy));
    }

    return Circle;
}(Ellipse);

module.exports = {
    Vector: SAT.Vector,
    Polygon: Polygon,
    Rectangle: Rectangle,
    Ellipse: Ellipse,
    Square: Square,
    Circle: Circle
};