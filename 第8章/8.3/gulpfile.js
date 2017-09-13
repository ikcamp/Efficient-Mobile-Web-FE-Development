var gulp = require("gulp");
gulp.task("default", function () {
    // 此处定义default任务处理过程。
    console.log("this is default task")
})

var babel = require("gulp-babel")
gulp.task("compile-js", function () {
    gulp.src("src/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist/js"));
});

var sass = require("gulp-sass");
gulp.task("compile-sass", function () {
    gulp.src("theme/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("dist/css"));
});

var spritesmith = require('gulp.spritesmith');
gulp.task("sprite", function () {
    gulp.src("theme/images/**.png")
        .pipe(spritesmith({
            imgName: 'images/icons.png',
            cssName: 'icons.css'
        }))
        .pipe(gulp.dest("dist/css"));
});

var eslint = require("gulp-eslint");
gulp.task("eslint", function () {
    gulp.src("src/**/*.js")
        .pipe(eslint({
            useEslintrc: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError)
});

var sasslint = require("gulp-sass-lint");
gulp.task("sasslint", function () {
    gulp.src("theme/**/*.scss")
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
});

var concat = require("gulp-concat");
gulp.task("concat", ["compile-js", "compile-sass", "sprite", "copy-images"], function () {
    gulp.src("dist/css/*.css")
        .pipe(concat("style.css"))
        .pipe(gulp.dest("dist/latest"))
        .pipe(reload({
            stream: true
        }));

    gulp.src("dist/js/**/*.js")
        .pipe(concat("app.js"))
        .pipe(gulp.dest("dist/latest"))
        .pipe(reload({
            stream: true
        }));
});

gulp.task("copy-images", function () {
    gulp.src("dist/css/images/**.**")
        .pipe(gulp.dest("dist/latest/images"));
})


var browserSync = require("browser-sync");
var reload = browserSync.reload;
gulp.task("browser-sync", function () {
    browserSync({
        server: './'
    });
});

gulp.task("watch", ["concat", "browser-sync"], function () {
    gulp.watch(["src/**/*.js", "theme/**/*.scss"], ["concat"]);
})

var uglify = require("gulp-uglify");
var cssMinify = require("gulp-clean-css");
var rename = require("gulp-rename");
gulp.task("minify", ["concat"], function(){
    gulp.src("dist/latest/app.js")
    .pipe(uglify())
    .pipe(rename(function(path){
        path.basename += ".min"
    }))
    .pipe(gulp.dest("dist/latest"));
    gulp.src("dist/latest/style.css")
    .pipe(cssMinify())
    .pipe(rename(function(path){
        path.basename += ".min"
    }))
    .pipe(gulp.dest("dist/latest"));  
})
