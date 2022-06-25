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

// paths
var styleSrc = 'source/sass/**/*.sass',
    styleDest = 'build/assets/css/',
    htmlSrc = 'source/',
    htmlDest = 'build/',
    vendorSrc = 'source/js/vendors/',
    vendorDest = 'build/assets/js/',
    scriptSrc = 'source/js/*.js',
    scriptDest = 'build/assets/js/';


// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------

// Compiles all SASS files
gulp.task('sass', async function() {
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

gulp.task('images', async function() {
    gulp.src('source/img/*')
        .pipe(images([
            images.gifsicle({interlaced: true}),
            images.mozjpeg({quality: 75, progressive: true}),
            images.optipng({optimizationLevel: 5}),
            images.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('build/assets/img'));
});

// Uglify js files
gulp.task('scripts', async function() {
    gulp.src('source/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'));
});


//Concat and Compress Vendor .js files
gulp.task('vendors', async function() {
    gulp.src(
            [
                'source/js/vendors/jquery.min.js',
                'source/js/vendors/*.js'
            ], {allowEmpty: true})
        .pipe(plumber())
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'));
});

// Watch for changes
gulp.task('watch', function(){

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });

    gulp.watch(styleSrc,gulp.series('sass'));
    gulp.watch(scriptSrc,gulp.series('scripts'));
    gulp.watch(vendorSrc,gulp.series('vendors'));
    gulp.watch(['build/*.html', 'build/assets/css/*.css', 'build/assets/js/*.js', 'build/assets/js/vendors/*.js']).on('change', browserSync.reload);

});


// use default task to launch Browsersync and watch JS files
gulp.task('default', gulp.parallel('sass', 'images', 'scripts', 'vendors'));