var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    templates = require('gulp-angular-templatecache'),
    minifyHTML = require('gulp-minify-html'),
    gulpSequence = require('gulp-sequence');

gulp.task('sass', function () {
    return gulp.src('resources/sass/app.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest('public/css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css'))
});

gulp.task('templates', function () {
    var options = {
        standalone : true
    };
    return gulp.src(['resources/js/**/*.html'])
        .pipe(minifyHTML({
            quotes: true
        }))
        .pipe(templates('templates.js', options))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('concat', function () {
    return gulp.src([
        'public/js/templates.js',
        'resources/js/app.js',
        'resources/js/services/*.js',
        'resources/js/utilities/*.js',
        'resources/js/modules/**/*.js'])
        .pipe(concat('angular-app.js'))
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('concat-angular', function () {
    return gulp.src([
        'node_modules/angular/angular.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/angular-jwt/dist/angular-jwt.min.js',
        'node_modules/angular-resource/angular-resource.min.js',
        'node_modules/angular-permission/dist/angular-permission.min.js',
        'node_modules/angular-permission/dist/angular-permission-ui.min.js',
        'node_modules/angularjs-datepicker/dist/angular-datepicker.min.js',
        'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
        'public/js/angular-app-debug.js'
       ])
        .pipe(concat('angular.js'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('concat-angular-css', function () {
        return gulp.src([
            'node_modules/angularjs-datepicker/dist/angular-datepicker.min.css',
            'node_modules/angular-toastr/dist/angular-toastr.min.css'
        ])
        .pipe(plumber())
        .pipe(cssmin())
        .pipe(concat('angular.min.css'))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('default', function () {
    gulpSequence('sass', 'templates', 'concat', 'concat-angular', 'concat-angular-css')
    (function (err) {
        if (err) console.log(err);
    });
});

gulp.task('watch', function() {
    gulp.start('default');

    gulp.watch(['resources/sass/**/*'], function (event) {
        gulp.start('sass');
    });

    gulp.watch(['resources/js/**/*'], function (event) {
        gulpSequence('templates', 'concat', 'concat-angular')(function (err) {
            if (err) console.log(err);
        })
    });
});