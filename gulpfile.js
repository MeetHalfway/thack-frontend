// include gulp
var gulp = require('gulp');

// include core modules
var path  = require("path");

// include gulp plug-ins
var changed 	= require('gulp-changed'),
    imagemin 	= require('gulp-imagemin'),
    concat 		= require('gulp-concat'),
    coffee      = require('gulp-coffee'),
    stripDebug 	= require('gulp-strip-debug'),
    uglify 		= require('gulp-uglify'),
    autoprefix  = require('gulp-autoprefixer'),
    minifyCSS 	= require('gulp-minify-css'),
    sass 		= require('gulp-ruby-sass'),
    notify		= require('gulp-notify'),
    plumber 	= require('gulp-plumber'),
    webserver   = require('gulp-webserver'),
    gulpif      = require('gulp-if'),
    ngAnnotate  = require('gulp-ng-annotate'),
    merge       = require('gulp-merge'),
    angularTemplateCache = require('gulp-angular-templatecache');

/****************************************************************************************************/
/* SETTING UP DEVELOPMENT ENVIRONMENT                                                               */
/****************************************************************************************************/
var production = false;

// the title and icon that will be used for notifications
var notifyInfo = {
  title: 'Gulp',
  icon: path.join(__dirname, 'gulp.png')
};

// error notification settings for plumber
var plumberErrorHandler = {
  errorHandler: notify.onError({
    title: notifyInfo.title,
    icon: notifyInfo.icon,
    message: "Error: <%= error.message %>"
  })
};

/****************************************************************************************************/
/* BUILD TASKS                                                                                      */
/****************************************************************************************************/

// copy font-awesome and compile styles
gulp.task('styles', function() {
  gulp.src([
    'bower_components/font-awesome/fonts/*'
  ])
  .pipe(gulp.dest("build/fonts"));

  // uncomment this part to include vendor css
  /**
  gulp.src([
    'bower_components/...'
  ])
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest("build/styles"));
  */

  return gulp.src([
    'styles/*.sass'
  ])
  .pipe(plumber(plumberErrorHandler))
  .pipe(sass({ style: 'expanded' }))
  .pipe(gulpif(production, autoprefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1')))
  .pipe(gulpif(production, minifyCSS()))
  .pipe(gulp.dest('build/styles'));
});

// minify images
gulp.task('images', function() {
  var imgSrc = 'images/**/*',
      imgDst = 'build/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// copy html
gulp.task('pre-process', function() {
  gulp.src('index.html')
	.pipe(gulp.dest('build/'));
});

// start development web server
gulp.task('webserver', function() {
  gulp.src('build/')
    .pipe(webserver({
      livereload: true,
      open: '/',
      proxies: [
        { source: '/api', target: 'http://localhost:8080/'}
      ]
    }));
});

// process and compile all script files
gulp.task('scripts', function() {
  gulp.src([
    'bower_components/angular/angular.js',
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/js/tooltip.js',
    'bower_components/bootstrap/js/*.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/use-angular-translate/src/**/*.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/moment/min/moment.min.js',
    'bower_components/lodash/lodash.min.js',
    'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'bower_components/angular-ui-sortable/sortable.min.js',
    'bower_components/ngstorage/ngStorage.min.js',
    'bower_components/fastclick/lib/fastclick.js'
  ])
  .pipe(plumber(plumberErrorHandler))
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('build/scripts'));

  merge(
    gulp.src([
      'templates/**/*'
    ])
    .pipe(angularTemplateCache('templates.js',{
      root: 'templates/',
      module: 'app.templates',
      standalone: true
    })),
    gulp.src([
      'scripts/**/_*.js',
      'scripts/**/*.js'
    ])
  )
  .pipe(plumber(plumberErrorHandler))
  .pipe(
    gulpif(
      /[.]coffee$/,
      coffee({bare: true})
    )
  )
  .pipe(concat('script.js'))
  .pipe(gulpif(production, ngAnnotate()))
  .pipe(gulpif(production, stripDebug()))
  .pipe(gulpif(production, uglify()))
  .pipe(gulp.dest('build/scripts'));
});

// gulp task suite
gulp.task('live', ['pre-process', 'styles', 'scripts', 'images', 'webserver'], function() {
  gulp.watch('index.html', ['pre-process']);
  gulp.watch('styles/**/*.sass', ['styles']);
  gulp.watch(['templates/**/*.html', 'scripts/**/*.js'], ['scripts']);
});

gulp.task('build', ['pre-process', 'styles', 'scripts', 'images'], function() {});
