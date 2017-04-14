'use strict';

var types = {
    Entity: {
        Player: 0,
        Bullet: 1
    }
};

if (typeof window === 'undefined') {
    module.exports = types;
}
