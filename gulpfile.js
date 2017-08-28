'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var ts = require('gulp-typescript');

//var tsProject = ts.createProject();

gulp.task('server-typescript', function(){
    return gulp.src(['src/*.ts', 'src/*.js'])
        .pipe(babel({
            presets: [
                ['latest', {
                    es2015: { modules: false }
                }]
            ],
            plugins: [
                ['transform-strict-mode', {
                  strict: true
                }]
            ]
        }))
        .pipe(ts({
            exclude: 'node_modules',
            types: ['node'],
            allowJs: true,
            target: 'ES5',
            allowImplicitAny: false
        }))
        .pipe(gulp.dest('dist'));
});
