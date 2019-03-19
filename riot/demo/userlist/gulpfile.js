const gulp = require('gulp');
const riot = require('gulp-riot3');
const gulpIf = require('gulp-if');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const multipipe = require('multipipe');
const browserSync = require('browser-sync').create();
const del = require('del');
let production = false;
let newLine;

function scripts() {
  return gulp.src([
    'node_modules/riot/riot.min.js',
    'node_modules/riot-route/dist/route+tag.min.js',
    'src/views/**/*.tag',
    'src/models/**/*.js',
    'src/App.js'
  ])
    .pipe(gulpIf(file => !file.path.includes('/node_modules/'), multipipe(
      gulpIf('*.tag', riot()),
      gulpIf(production, multipipe(
        babel({ presets: ['@babel/env'], sourceType: 'unambiguous' }),
        uglify()
      ))
    )))
    .pipe(concat('build.js', { newLine }))
    .pipe(gulp.dest('dist'));
}

function serve(done) {
  browserSync.init({
    server: { baseDir: './' },
    notify: false
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function public(done) {
  production = true;
  newLine = '';
  done();
}

function clean() {
  return del('dist');
}

function watch() {
  gulp.watch('*.html', gulp.series(reload));
  gulp.watch('src/**/*.{tag,js}', gulp.series(scripts, reload));
}

const dev = gulp.series(clean, scripts, serve, watch);
const build = gulp.series(public, dev);

gulp.task('default', dev);
gulp.task('build', build);
