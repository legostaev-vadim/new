const gulp = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const multipipe = require('multipipe');
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const del = require('del');
let mode = 'development';
let newLine;

function styles() {
  return gulp.src([
    // 'node_modules/materialize-css/dist/css/materialize.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'src/styles/index.scss'
  ])
    .pipe(gulpIf('*.scss', multipipe(
      sass(),
      gulpIf(mode === 'production', multipipe(
        autoprefixer({ browsers: ['last 15 versions'] }),
        csscomb(),
        cleanCSS()
      ))
    )))
    .pipe(concat('main.css', { newLine }))
    .pipe(gulp.dest('dist'));
}

function scripts() {
  return gulp.src('src/scripts/index.js')
    .pipe(webpack({
      mode,
      output: { filename: 'main.js' },
      module: {
        rules: [
          { test: /\.tag$/, exclude: /node_modules/, use: ["babel-loader", "riot-tag-loader"] },
          { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
      }
    }))
    .pipe(gulp.dest('dist'));
}

function copy() {
  return gulp.src('src/assets/**/*')
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
  mode = 'production';
  newLine = '';
  done();
}

function clean() {
  return del('dist');
}

function watch() {
  gulp.watch('*.html', gulp.series(reload));
  gulp.watch('src/styles/**/*.scss', gulp.series(styles, reload));
  gulp.watch('src/scripts/**/*.{tag,js}', gulp.series(scripts, reload));
}

const dev = gulp.series(clean, copy, gulp.parallel(styles, scripts), serve, watch);
const build = gulp.series(public, dev);

gulp.task('default', dev);
gulp.task('build', build);