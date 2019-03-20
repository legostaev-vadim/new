const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpIf = require('gulp-if');
const webpack = require('webpack-stream');
const multipipe = require('multipipe');
const gulpAutoprefixer = require('gulp-autoprefixer');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss')
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const del = require('del');
let mode = 'development';

function styles() {
  return gulp.src('src/styles/build.scss')
    .pipe(sass())
    .pipe(gulpIf(mode === 'production', multipipe(
      gulpAutoprefixer({ browsers: ['last 15 versions'] }),
      cleanCSS()
    )))
    .pipe(gulp.dest('dist'));
}

function tags() {
  return gulp.src('src/App.js')
    .pipe(webpack({
      mode,
      output: { filename: 'build.js' },
      module: {
        rules: [
          {
            test: /\.tag$/,
            exclude: /(node_modules|bower_components)/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              },
              {
                loader: "riot-tag-new-loader",
                options: {
                  parsers: {
                    css: {
                      plain: function(tag, css) {
                        if(mode === 'production') return postcss([ autoprefixer({ browsers: ['last 15 versions'] }) ]).process(css).css
                        return css
                      }
                    }
                  }
                }
              }
            ]
          },
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
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
    notify: false,
    // open: false
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function public(done) {
  mode = 'production';
  done();
}

function clean() {
  return del('dist');
}

function watch() {
  gulp.watch('*.html', gulp.series(reload));
  gulp.watch('src/styles/**/*.scss', gulp.series(styles, reload));
  gulp.watch('src/**/*.{tag,js}', gulp.series(tags, reload));
  gulp.watch('src/assets/**/*', gulp.series(copy, reload));
}

const dev = gulp.series(clean, copy, styles, tags, serve, watch);
const build = gulp.series(public, dev);

gulp.task('default', dev);
gulp.task('build', build);