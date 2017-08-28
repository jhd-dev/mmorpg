'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var profiler = require('v8-profiler');
var fs = require('fs');

var ProfilerManager = function () {
    function ProfilerManager(dir) {
        _classCallCheck(this, ProfilerManager);

        this.dir = dir;
    }

    _createClass(ProfilerManager, [{
        key: 'startProfiling',
        value: function startProfiling(name, time) {
            profiler.startProfiling(name, true);
            setTimeout(function () {
                var profile1 = profiler.stopProfiling(name);
                profile1.export(function (err, result) {
                    if (err) throw err;
                    fs.writeFile('../' + name + '.cpuprofile', result);
                    profile1.delete();
                    console.log('Profile saved.');
                }, time);
            });
        }
    }]);

    return ProfilerManager;
}();

module.exports = ProfilerManager;