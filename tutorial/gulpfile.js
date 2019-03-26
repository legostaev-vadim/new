const gulp = require('gulp')
const concat = require('gulp-concat')
const markdown = require('gulp-markdown')

gulp.task('default', gulp.series(
  function () {
    return gulp.src('md/**/*.md')
      .pipe(concat('tutorial.md'))
      .pipe(markdown())
      .pipe(gulp.dest('html'))
  },
  function () {
    return gulp.src('md/**/*.md')
      .pipe(concat('tutorial.md'))
      .pipe(gulp.dest('md'))
  }
))