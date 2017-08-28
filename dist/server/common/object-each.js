'use strict';

module.exports = function (obj, fn) {
    return Object.keys(obj).map(function (key) {
        return fn(obj[key], key, obj);
    });
};