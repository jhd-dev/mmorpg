'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var base = './src';
var dest = './dist';
//var tsProject = ts.createProject();

gulp.task('copy-files', function(){
    return gulp.src(['./src/client/img/**/*', './src/client/fonts/**/*', './src/shared/game/maps/**/*'], { base: base })
        .pipe(gulp.dest(dest));
});

gulp.task('server-typescript', function(){
    return gulp.src(['./src/**/*.ts', './src/**/*.js'], { base: base })
        .pipe(ts({
            exclude: 'node_modules',
            types: ['node'],
            allowJs: true,
            target: 'ES6',
        }))
        .pipe(babel({
            presets: [
                ["latest", {
                  es2015: { modules: false }
                }]
            ],
            plugins: [
                ["transform-strict-mode", {
                  strict: true
                }]
            ]
        }))
        //.pipe(uglify())
        .pipe(gulp.dest(dest));
});

gulp.task('sass', function(){
    return gulp.src('./src/client/scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./dist/client/css'));
});
