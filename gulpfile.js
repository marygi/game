var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    assets  = require('postcss-assets'),
    mqpacker = require('css-mqpacker'),
    autoprefixer = require('autoprefixer'),
    plumber = require('gulp-plumber'),
    cache = require('gulp-cached'),
    gulpif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    fs = require('fs'),
    config = {
        appJsDir: 'app/js/',
        appCssDir: 'app/scss/',
        appImgDir: 'app/images/',
        appFontDir: 'app/fonts/',
        distJsDir: 'dist/js/',
        distCssDir: 'dist/css/',
        distImgDir: 'dist/images/',
        distFontDir: 'dist/fonts/',
        sourceMaps: false
    };

gulp.task('scripts', function() {
    return gulp.src(config.appJsDir + 'main.js')
        .pipe(plumber())
        .pipe(cache('main.js'))
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(uglify())
        .pipe(gulpif(config.sourceMaps, sourcemaps.write()))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.distJsDir));
});

gulp.task('styles', function() {
    return gulp.src(config.appCssDir + 'main.scss')
        .pipe(plumber())
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(sass(/*{outputStyle: 'compressed'}*/).on('error', sass.logError))
        .pipe(postcss(
            [
                assets({
                    relative: true,
                    loadPaths: ['app/images','app/fonts'],
                    cachebuster: function (filePath, urlPathname) {
                        return fs.statSync(filePath).size.toString(36);
                    }
                }),
                autoprefixer({
                    remove: false,
                    browsers: [ 'last 2 versions']
                }),
                mqpacker
            ]
        ))
        .pipe(gulpif(config.sourceMaps, sourcemaps.write()))
        .pipe(gulp.dest(config.distCssDir));
});

gulp.task('images', function(){
    return gulp.src(config.appImgDir + '/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(gulp.dest(config.distImgDir))
});

gulp.task('fonts', function() {
    return gulp.src(config.appFontDir  + '**/*.+(ttf|woff|eot|svg)')
        .pipe(gulp.dest(config.distFontDir))
});

gulp.task('watch', function() {
    gulp.watch(config.appJsDir + '**', ['scripts']);
    gulp.watch(config.appCssDir + '**', ['styles']);
    gulp.watch(config.appImgDir + '**', ['images']);
    gulp.watch(config.appFontDir + '**', ['fonts']);
});

gulp.task('clearCache', function() {
    cache.caches = {};
});

gulp.task('enableSourceMaps', function() {
    config.sourceMaps = true;
});

gulp.task('debug', ['enableSourceMaps', 'default']);

gulp.task('default', ['clearCache', 'styles', 'scripts', 'fonts', 'images', 'watch']);