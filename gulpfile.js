var gulp = require('gulp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var print = require('gulp-print').default;
var clean = require('gulp-clean');
const gap = require('gulp-append-prepend');
var rename = require("gulp-rename");

gulp.task('clean', function () {
    return gulp.src('dist/**/*.*')
        .pipe(print(filepath => `dest: ${filepath}`))
        .pipe(clean({force: true}));
  });
  gulp.task('minify', function () {
    return gulp.src('dist/angularjs-appinsights.js')
        .pipe(print(filepath => `dest: ${filepath}`))
        .pipe(uglify())
        .pipe(rename(function(path){
            if(path.extname == ".js")
                path.basename += ".min";
        }))
        .pipe(gulp.dest('dist'));
  });

gulp.task('build',gulp.series('clean',function () {
    var tsProject = ts.createProject('tsconfig.json');
    return gulp.src('src/*.ts')
        .pipe(print(filepath => `source: ${filepath}`))
        .pipe(tsProject())
        .pipe(print(filepath => `tranformed: ${filepath}`))
        .pipe(gap.appendFile('src/setup-snippet.js'))
        .pipe(gulp.dest('dist'))
}));