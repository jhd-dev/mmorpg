'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Inventory = function () {
    function Inventory(player) {
        _classCallCheck(this, Inventory);

        this.player = player;
        this.items = ['potion'];
        this.prevPack = {
            items: this.items
        };
    }

    _createClass(Inventory, [{
        key: 'getClientPack',
        value: function getClientPack() {
            return {
                items: this.items.map(function (item) {
                    return {
                        type: item
                    };
                })
            };
        }
    }, {
        key: 'addItem',
        value: function addItem(type) {
            var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            this.items.push({
                type: type
            });
        }
    }, {
        key: 'useItem',
        value: function useItem(index) {
            var item = this.items[index];
            if (item.type === 'potion') {
                this.player.hp = Math.min(this.player.hp + 5, this.player.maxHp);
            }
            this.removeItemByIndex(index);
        }
    }, {
        key: 'removeItemByType',
        value: function removeItemByType(type) {
            var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            for (var i = 0; i < amount; i++) {
                if (this.items.includes(type)) {
                    this.items.splice(this.items.indexOf(type), 1);
                }
            }
        }
    }, {
        key: 'removeItemByIndex',
        value: function removeItemByIndex(index) {
            this.items.splice(index, 1);
        }
    }, {
        key: 'getData',
        value: function getData() {
            return {
                items: this.items
            };
        }
    }]);

    return Inventory;
}();

module.exports = Inventory;