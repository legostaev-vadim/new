const gulp = require('gulp');
const pug = require('gulp-pug');
const pugbem = require('gulp-pugbem');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const cleanCSS = require('gulp-clean-css');
const multipipe = require('multipipe');
const flatmap = require('gulp-flatmap');
const remember = require('gulp-remember');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const merge2 = require('merge2');
const concat = require('gulp-concat');
const svgSprite = require('gulp-svg-sprites');
const save = require('gulp-save');
const gulpIf = require('gulp-if');
const del = require('del');
let mode = 'development';
let isSymbol = false;
let isLayouts = false;
let isStyles = false;
let saveLayouts;
let saveStyles;
let basename;
let newLine;
// pugbem.m = '_';


function preLayouts() {
  return saveLayouts = gulp.src([
    // 'src/layouts/helpers/variables.pug',
    // 'src/layouts/helpers/mixins.pug',
    'src/components/**/*.pug'
  ], {since: gulp.lastRun(preLayouts)})
    .pipe(remember('preLayouts'))
    .pipe(save('preLayouts'))
    .on('end', () => {
      if(isLayouts) remember.forgetAll('layouts');
      isLayouts = false;
    });
}

function layouts() {
  return gulp.src([
    'src/layouts/*.pug'
  ], {since: () => {
    if(isLayouts) return gulp.lastRun(layouts);
    return undefined;
  }})
    .pipe(flatmap(function(stream, file) {
      return merge2(saveLayouts.pipe(save.restore('preLayouts')), stream)
        .pipe(concat({path: file.path, base: file.base}));
    }))
    .pipe(pug({pretty: true, plugins: [pugbem]}))
    .pipe(remember('layouts'))
    .pipe(gulp.dest(file => {
      basename = file.basename.replace('.inc.', '.');
      if(basename !== file.basename) {
        file.basename = basename;
        file.extname = '.php';
        return 'dist/includes';
      }
      return 'dist/pages';
    }))
    .on('end', () => isLayouts = true);
}

function preStyles() {
  return saveStyles = gulp.src([
    'src/styles/helpers/variables.scss',
    'src/styles/helpers/mixins.scss'
  ], { since: gulp.lastRun(preStyles) })
    .pipe(remember('preStyles'))
    .pipe(save('preStyles'))
    .on('end', () => {
      if(isStyles) remember.forgetAll('styles');
      isStyles = false;
    });
}

function styles() {
  return gulp.src([
    // 'node_modules/materialize-css/dist/css/materialize.min.css',
    // 'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/normalize.css/normalize.css',
    'src/libs/jquery.simple-popup.min.css',
    'src/libs/animate.min.css',
    'src/styles/base/**/*.scss',
    'src/styles/index.scss',
    'src/components/**/*.scss',
    'src/styles/layouts/**/*.scss'
  ], {since: () => {
    if(isStyles) return gulp.lastRun(styles);
    return undefined;
  }})
    .pipe(gulpIf('*.scss', multipipe(
      flatmap(function(stream, file) {
        return merge2(saveStyles.pipe(save.restore('preStyles')), stream)
          .pipe(concat({path: file.path, base: file.base}));
      }),
      sass(),
      gulpIf(mode === 'production', multipipe(
        autoprefixer({ browsers: ['last 15 versions'] }),
        csscomb()
      ))
    )))
    .pipe(remember('styles'))
    .pipe(concat('main.css', { newLine }))
    .pipe(gulpIf(mode === 'production', cleanCSS()))
    .pipe(gulp.dest('dist'))
    .on('end', () => isStyles = true);
}

function scripts() {
  return gulp.src([
    // 'node_modules/materialize-css/dist/js/materialize.min.js',
    // 'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/riot-route/dist/route.min.js',
    'src/libs/jquery.simple-popup.min.js',
    'src/libs/jquery.validate.min.js',
    'src/libs/wow.min.js',
    'src/libs/parallax.js',
    'src/scripts/index.js',
    'src/components/**/*.js',
    'src/scripts/ajax/**/*.js'
  ], {since: gulp.lastRun(scripts)})
    .pipe(gulpIf(mode === 'production', gulpIf(file => !file.path.includes('/node_modules/'), multipipe(
      babel({ presets: ['@babel/env'], sourceType: 'unambiguous' }),
      uglify()
    ))))
    .pipe(remember('scripts'))
    .pipe(concat('main.js', { newLine }))
    .pipe(gulp.dest('dist'));
}

function symbols(done) {
  if(!isSymbol) done();
  else return gulp.src('src/symbols/**/*.svg')
    .pipe(svgSprite({
      mode: 'symbols',
      preview: false,
      svg: {
          symbols: 'main.svg'
      }
    }))
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
  gulp.watch('{src/layouts/helpers,src/components}/**/*.pug', gulp.series(preLayouts, layouts));
  gulp.watch('src/layouts/*.pug', gulp.series(layouts));
  gulp.watch(['src/styles/**/*.scss','!src/styles/layouts/**/*.scss'], gulp.series(preStyles, styles));
  gulp.watch('{src/components,src/styles/layouts}/**/*.scss', gulp.series(styles));
  gulp.watch('src/**/*.js', gulp.series(scripts));
  gulp.watch('src/symbols/**/*.svg', gulp.series(symbols));
  gulp.watch('src/assets/**/*', gulp.series(copy));
}

const dev = gulp.series(clean, copy, preLayouts, layouts, preStyles, styles, scripts, symbols, watch);
const build = gulp.series(public, dev);

gulp.task('default', dev);
gulp.task('build', build);