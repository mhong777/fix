// Include gulp and shared dependencies
var gulp = require('gulp'),
  server = require('gulp-develop-server'),
  ngAnnotate = require('gulp-ng-annotate'),
  connect = require('gulp-connect'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
  changed = require('gulp-changed'),
  imagemin = require('gulp-imagemin'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify'),
  autoprefix = require('gulp-autoprefixer'),
  minifyCSS = require('gulp-minify-css'),
  templateCache = require('gulp-angular-templatecache');

//source dev folder
var appAssetSrc = 'websrc';
//deployment folder
var appAssetDest = 'web-app';
//main module name
var moduleName = 'usaiddApp';

var paths = {
  src: {
    scripts: appAssetSrc + '/scripts/**/*.js',
    map_data: appAssetSrc + '/map_data/**/*.js',
    views: appAssetSrc + '/views/**/*.html',
    mainview: appAssetSrc + '/index.html',
    images: appAssetSrc + '/images/**/*.png',
    data: appAssetSrc + '/data/**/*.pdf',
    fonts: appAssetSrc + '/bower_components/bootstrap/fonts/*'
  },
  dest: {
    scripts: appAssetDest + '/js',
    views: appAssetDest + '/views/',
    styles: appAssetDest + '/css',
    images: appAssetDest + '/images',
    data: appAssetDest + '/data',
    fonts: appAssetDest + '/fonts'
  }
};

gulp.task('buildblocks', ['tempcache'], function () {
  var assets = useref.assets();
  return gulp.src(paths.src.mainview)
    .pipe(assets)
    .pipe(gulpif('*.js', ngAnnotate()))
    .pipe(gulpif(!'nocatjs'&&'*.js', uglify()))
    .pipe(gulpif(['*.css'], minifyCSS()))
    .pipe(gulpif(['*.css'], autoprefix("last 2 version", "> 1%")))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(notify({
      title: 'Concat, Min all CSS & JS declared in source index build: blocks',
      message: 'Job has finished',
      onLast: true
    }))
    .pipe(gulp.dest(appAssetDest));
});

//make an angular template cache
gulp.task('tempcache', function () {
  gulp.src(paths.src.views)
    .pipe(templateCache({
        module: moduleName,
        root: 'views/'
      }
    ))
    .pipe(gulp.dest(appAssetSrc + '/scripts'));
});

gulp.task('images', function () {
  return gulp.src(paths.src.images)
    .pipe(changed(paths.dest.images)) // Ignore unchanged files
    .pipe(imagemin()) // Optimize
    .pipe(notify({
      title: 'Images optimized',
      message: 'Job has finished',
      onLast: true
    }))
    .pipe(gulp.dest(paths.dest.images));
});

gulp.task('favicon', function () {
  return gulp.src(appAssetSrc + '/favicon.ico')
    .pipe(changed(appAssetDest))
    .pipe(gulp.dest(appAssetDest));
});

gulp.task('fonts', [], function () {
  gulp.src(paths.src.fonts)
    .pipe(changed(paths.dest.fonts))
    .pipe(notify({
      title: 'Fonts copied',
      message: 'Job has finished',
      onLast: true
    }))
    .pipe(gulp.dest(paths.dest.fonts));
});

gulp.task('data', [], function () {
  gulp.src(paths.src.data)
    .pipe(changed(paths.dest.data))
    .pipe(notify({
      title: 'Data copied',
      message: 'Job has finished',
      onLast: true
    }))
    .pipe(gulp.dest(paths.dest.data));
});

//defines our webserver
gulp.task('serve', function () {
  connect.server({
    //specify our root hosting location
    root: 'web-app',
    port: 8100,
    livereload: true
  });
});

gulp.task('watch', function () {
  // watches JavaScript files for changes
  gulp.watch(appAssetSrc + '/scripts/**/*.js', ['buildblocks'], server.restart);

  // watches Mapdata files for changes
  gulp.watch(appAssetSrc + '/map_data/**/*.js', ['buildblocks'], server.restart);

  // watches html files for changes
  gulp.watch(appAssetSrc + '/**/*.html', ['buildblocks'], server.restart);

  // watches css files for changes
  gulp.watch(appAssetSrc + '/css/**/*.css', ['buildblocks'], server.restart);
});

gulp.task('default', ['deploy', 'serve']);
gulp.task('deploy', ['buildblocks', 'images', 'data', 'fonts', 'favicon']);
