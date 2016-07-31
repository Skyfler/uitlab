var gulp = require('gulp'), 
    webpack = require('webpack'), 
    gulpWebpack = require('webpack-stream'),
    cssmin = require('gulp-cssmin'),
    /*imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),*/
    fileinclude = require('gulp-file-include'),
    htmlmin = require('gulp-htmlmin'),
    browserSync = require("browser-sync"),
    rimraf = require('rimraf'),
    uglify = require('gulp-uglify'),
    concatCss = require('gulp-concat-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename');

var config = {
    server: {
        baseDir: "./public"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Skyfler"
};

var path = {
    public: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: './public/',
        js: './public/scripts/',
        css: './public/css/',
        img: './public/img/'
    },
    dev: { //Пути откуда брать исходники
        html: './dev/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: './dev/scripts/page.js',//В стилях и скриптах нам понадобятся только main файлы
        jsie: './dev/scripts/ie/*',
        css: './dev/css/*.css',
        img: './dev/img/**/*.*' //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    },
    clean: './public'
};

gulp.task('webpack', function() {
    gulp.src(path.dev.js)
        .pipe(gulpWebpack({
            output: {
                filename: "build.min.js"
            },
            /*plugins: [
                new webpack.optimize.UglifyJsPlugin({minimize: true})
            ],*/
            devtool: 'source-map'
        }, webpack))
        .pipe(gulp.dest(path.public.js));
});

gulp.task('jsIe', function () {
    gulp.src(path.dev.jsie)
        .pipe(uglify())
        .pipe(gulp.dest(path.public.js));
});

gulp.task('js', ['webpack', 'jsIe']);

gulp.task('css', function () {
    gulp.src(path.dev.css)
        .pipe(concatCss("stylesheet.css"))
        .pipe(autoprefixer([
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6'
        ]))
        //.pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.public.css));
});

gulp.task('image', function () {
    gulp.src(path.dev.img)
        /*.pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))*/
        .pipe(gulp.dest(path.public.img));
});

gulp.task('html', function() {
    gulp.src(path.dev.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            processConditionalComments: true,
            removeComments: true
        }))
        .pipe(gulp.dest(path.public.html));
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('l', ['html', 'css']);

gulp.task('default', ['html', 'css', 'js', 'image']);