var gulp  = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var sass  = require('gulp-sass');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var eslintRc = require('./eslintrc');

var runSequence = require('run-sequence');

gulp.task('build-html', function() {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy-assets', function() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('lint', function() {
  return gulp.src('src/js/**/*.js').pipe(eslint({
    'rules': eslintRc.rules
  }))
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

gulp.task('build-css', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('build-js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function () {
    return gulp.src([
            'dist',
            'node_modules'
        ], {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch([
        'src/js/**/*.js',
        'src/scss/**/*.scss'
    ], function() {
        runSequence('lint', 'build-js', 'build-css');
    });
});

gulp.task('default', function(callback) {
  runSequence('lint', 'build-html', 'copy-assets', 'build-css', 'build-js', callback);
});
