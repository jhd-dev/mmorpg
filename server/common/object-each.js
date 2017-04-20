'use strict';

module.exports = function(obj, fn){
    return Object.keys(obj).map(key => fn(obj[key], key, obj));
};
