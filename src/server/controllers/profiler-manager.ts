'use strict';

const profiler = require('v8-profiler');
const fs = require('fs');

class ProfilerManager {
    
    constructor(dir){
        this.dir = dir;
    }
    
    startProfiling(name, time){
        profiler.startProfiling(name, true);
        setTimeout(() => {
            let profile1 = profiler.stopProfiling(name);
            profile1.export((err, result) => {
                if (err) throw err;
                fs.writeFile('../' + name + '.cpuprofile', result);
                profile1.delete();
                console.log('Profile saved.');
            }, time);
        });
    }
    
}

module.exports = ProfilerManager;
