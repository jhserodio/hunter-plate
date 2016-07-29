/*==========================================================================
TASKS CONFIGURATION
==========================================================================*/

var gulp = require('gulp');
  //postcss requires
var postcss        = require('gulp-postcss'),
    nano           = require('cssnano'),
    cssimport      = require('postcss-import'),
    comments       = require('postcss-discard-comments'),
    normalize      = require('postcss-normalize'),
    calc           = require('postcss-calc'),
    variables      = require('postcss-custom-properties'),
    media          = require('postcss-custom-media'),
    selectors      = require('postcss-custom-selectors'),
    fontpath       = require('postcss-fontpath'),
    minmax         = require('postcss-media-minmax'),
    colors         = require('postcss-color-function'),
    styleguide     = require('postcss-style-guide'),

  // image compress
    imagemin       = require('gulp-imagemin'),

  // html compress
    htmlmin        = require('gulp-htmlmin'),

  // javascript compress
      webpack       = require('webpack-stream'),
      webpackconfig = require('./webpack.config.js'),
      uglify         = require('gulp-uglify'),

  // utilities
    concat         = require('gulp-concat'),
    cache          = require('gulp-cache'),
    copy           = require('gulp-copy-rex'),
    sourcemaps     = require('gulp-sourcemaps'),
    browsersync    = require("browser-sync"),
    reload         = browsersync.reload,
    plumber        = require('gulp-plumber');


// GLOBAL VARIABLES

// paths
var src_css   = "resources/assets/css/style.css",
    src_img   = "resources/assets/images/*",
    src_font  = "resources/assets/fonts/*",
    src_js    = "resources/assets/js/**/*.js",
    src_html  = "resources/views/*.html"
    dest_css  = "public/css",
    dest_font = "public/fonts/",
    dest_img  = "public/images",
    dest_js   = "public/js",
    dest_html = "public",
    wtc_css   = "resources/assets/css/**/*",
    wtc_html  = src_html,
    wtc_js    = src_js,
    wtc_img   = src_img,
    wtc_fonts = src_font;

// postcss processors

var processors = [
  cssimport,
  variables,
  calc,
  media,
  selectors,
  minmax,
  colors,
  fontpath
];

var processors_prod = [
  cssimport,
  variables,
  calc,
  media,
  selectors,
  minmax,
  colors,
  fontpath,
  comments,
  styleguide({
    project: 'Styleguide',
    dest: './styleguide/index.html',
    showCode: false,
    themePath: 'node_modules/psg-theme-1column'
  }),
  nano({
    autoprefixer: { browsers: [
      'Android >= 2.3',
      'BlackBerry >= 7',
      'Chrome >= 9',
      'Firefox >= 4',
      'Explorer >= 9',
      'iOS >= 5',
      'Opera >= 11',
      'Safari >= 5',
      'OperaMobile >= 11',
      'OperaMini >= 6',
      'ChromeAndroid >= 9',
      'FirefoxAndroid >= 4',
      'ExplorerMobile >= 9'
    ]}
  })
];

// TASKS DECLARATION

// style tasks

// dev
gulp.task('postcss', function () {
  return gulp.src(src_css)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write("map"))
    .pipe(gulp.dest(dest_css));
});
// prod
gulp.task('postcss:prod', function () {
  return gulp.src(src_css)
    .pipe(sourcemaps.init())
    .pipe(postcss(processors_prod))
    .pipe(sourcemaps.write("map"))
    .pipe(gulp.dest(dest_css));
});

// imagemin task
gulp.task('imagemin', function () {
  return gulp.src(src_img)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(dest_img));
});

// copy files
gulp.task('copy-fonts', function() {
  copy(src_font, dest_font);
});

// copy javascript files

// dev
gulp.task('webpack', function(){
  return gulp.src(wtc_js)
    .pipe(plumber())
    .pipe(webpack(webpackconfig))
    .pipe(gulp.dest(dest_js))
});

// prod
gulp.task('webpack:prod', function(){
  return gulp.src(wtc_js)
    .pipe(plumber())
    .pipe(webpack(webpackconfig))
    .pipe(uglify())
    .pipe(gulp.dest(dest_js))
});

// html minifier
gulp.task('htmlmin', function() {
  return gulp.src(src_html)
         .pipe(htmlmin({collapseWhitespace: true}))
         .pipe(gulp.dest(dest_html));
});

// browsersync server
gulp.task('browsersync', function(){
  browsersync.init({
    server: {
      baseDir: './public'
    },
    ghostMode: false,
    port: 8080,
    notify: false,
    reloadOnRestart: false,
    logFileChanges: false,
    logConnections: false
    })
});

// watch
gulp.task('watch', ['browsersync'], function(){
  gulp.watch(wtc_css, ['postcss', reload]);
  gulp.watch(wtc_js, ['webpack', reload]);
  gulp.watch(wtc_fonts, ['copy-fonts', reload]);
  gulp.watch(wtc_img, ['imagemin', reload]);
  gulp.watch(wtc_html, ['htmlmin', reload]);
});

// default task
gulp.task('default', ['watch']);

// production task
gulp.task('production', ['postcss:prod', 'webpack:prod', 'copy-fonts', 'imagemin', 'htmlmin'])
