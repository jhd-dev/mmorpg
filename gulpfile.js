'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

//var tsProject = ts.createProject();

gulp.task('server-typescript', function(){
    return gulp.src(['src/**/*.ts', 'src/**/*.js'], { base: './src' })
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
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function(){
    return gulp.src('./src/client/scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./dist/client/css'));
});
