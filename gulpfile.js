import images from 'gulp-imagemin';
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import del from 'del';
import cleanCSS from 'gulp-clean-css';
import plumber from 'gulp-plumber';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);


// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------

// Compiles all SASS files
gulp.task('sass', function() {
    gulp.src('source/sass/**/*.sass')
    .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({
            style: 'compressed'
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
          }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/assets/css'));
});

