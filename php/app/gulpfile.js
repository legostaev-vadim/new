const gulp = require('gulp');
const pug = require('gulp-pug');
const pugbem = require('gulp-pugbem');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const cleanCSS = require('gulp-clean-css');
const multipipe = require('multipipe');
const flatmap = require('gulp-flatmap');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const merge2 = require('merge2');
const concat = require('gulp-concat');
const save = require('gulp-save');
const gulpIf = require('gulp-if');
const del = require('del');
let mode = 'development';
let saveViews;
let newLine;
pugbem.m = '_';

function views() {
  return saveViews = gulp.src('src/markups/views/**/*.pug')
    .pipe(save('views'));
}

function markups() {
  return gulp.src('src/markups/*.pug')
    .pipe(flatmap(function(stream, file) {
      return merge2(saveViews.pipe(save.restore('views')), stream)
        .pipe(concat(file.basename));
    }))
    .pipe(pug({pretty: true /*, plugins: [pugbem]*/}))
    .pipe(gulp.dest(function(file) {
      let basename = file.basename.replace('.inc.', '.');
      if(basename !== file.basename) {
        file.basename = basename;
        file.extname = '.php';
        return 'dist/includes';
      }
      else return 'dist/pages';
    }));
}

function styles() {
  return gulp.src([
    'node_modules/materialize-css/dist/css/materialize.min.css',
    // 'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'src/styles/helpers/variables.scss',
    'src/styles/helpers/mixins.scss',
    'src/styles/views/**/*.scss',
    'src/styles/base/**/*.scss',
    'src/styles/index.scss'
  ])
    .pipe(gulpIf('*.scss', multipipe(
      concat('main.scss'),
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
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/materialize-css/dist/js/materialize.min.js',
    'node_modules/riot-route/dist/route.min.js',
    'src/scripts/actions/**/*.js',
    'src/scripts/ajax/**/*.js',
    'src/scripts/index.js'
  ])
    .pipe(gulpIf(mode === 'production', gulpIf(file => !file.path.includes('/node_modules/'), multipipe(
      babel({ presets: ['@babel/env'], sourceType: 'unambiguous' }),
      uglify()
    ))))
    .pipe(concat('main.js', { newLine }))
    .pipe(gulp.dest('dist'));
}

function copy() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist'));
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
  gulp.watch('src/markups/views/**/*.pug', gulp.series(views, markups));
  gulp.watch('src/markups/*.pug', gulp.series(markups));
  gulp.watch('src/styles/**/*.scss', gulp.series(styles));
  gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
}

const dev = gulp.series(clean, copy, views, gulp.parallel(markups, styles, scripts), watch);
const build = gulp.series(public, dev);

gulp.task('default', dev);
gulp.task('build', build);