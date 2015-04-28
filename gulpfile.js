var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    jsonminify = require('gulp-jsonminify'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    filter = require('gulp-filter'),
    useref = require('gulp-useref'),
    minifyCss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    autoprefix = require('gulp-autoprefixer'),
    templateCache = require('gulp-angular-templatecache'),
    pngquant = require('imagemin-pngquant');

//main module name
var moduleName = 'fixApp';


//initialize variables and standard functions
var assets,
  angularFilter = filter('**/scripts.js'),
  bowerFilter = filter('**/vendor.js'),
  cssFilter = filter('**/*.css'),
  serverDir,
  sourceFiles=['app/**/*.js','app/**/*.css','app/**/*.html'];

gulp.task('connect', function(){
  gutil.log(serverDir);

  connect.server({
    root:serverDir,
    livereload: true
  });
});


/*************
 * EVERYTHING FOR DEVELOPMENT
 ************/
gulp.task('setDev', function(){
  serverDir = 'app';
  return gutil.log('Starting development server');
});

gulp.task('reload', function(){
  gulp.src('app/**/*.html')
    .pipe(connect.reload());
});

gulp.task('devWatch', function(){
  gulp.watch(sourceFiles, ['reload']);      //when you make a change it executes that function in the array
});

/*************
 * EVERYTHING FOR PRODUCTION
 ************/
gulp.task('setProd', function(){
  serverDir = 'build';
  return gutil.log('Building everything for production');
});


//make an angular template cache
gulp.task('tempcache', function () {
  gulp.src('app/views/**/*.html')
    .pipe(templateCache({
        module: moduleName,
        root: 'views/'
      }
    ))
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('build', ['tempcache','images'], function(){
  assets = useref.assets();
    return gulp.src('app/*.html')
      .pipe(assets) //grab the assets by bundle specified in html
      .pipe(angularFilter) //grab the js bundles
      .pipe(ngAnnotate()) //ng-annotate
      .pipe(uglify()) //minify
      .pipe(angularFilter.restore()) //grab the rest of the files again
      .pipe(bowerFilter) //grab the js bundles
      .pipe(uglify()) //minify
      .pipe(bowerFilter.restore()) //grab the rest of the files again
      .pipe(cssFilter)  //grab the css bundles
      .pipe(minifyCss())  //minify the css
      .pipe(autoprefix("last 2 version", "> 1%"))
      .pipe(cssFilter.restore())  //grab the rest of the files again
      .pipe(assets.restore()) //not sure
      .pipe(useref()) //plug everything in
      .pipe(gulp.dest('build'))  //output to the build folder
      .pipe(connect.reload()); //restart the server
});

gulp.task('buildTest', ['tempcache','images'], function(){
  angularFilter = filter('**/scripts.js');
  assets = useref.assets();
  return gulp.src('app/*.html')
    .pipe(assets) //grab the assets by bundle specified in html
    .pipe(angularFilter) //grab the js bundles
    //.pipe(ngAnnotate()) //ng-annotate
    //.pipe(uglify()) //minify
    //.pipe(angularFilter.restore()) //grab the rest of the files again
  //  .pipe(bowerFilter) //grab the js bundles
  //  .pipe(uglify()) //minify
  //  .pipe(bowerFilter.restore()) //grab the rest of the files again
  //  .pipe(cssFilter)  //grab the css bundles
  //  .pipe(minifyCss())  //minify the css
  //  .pipe(autoprefix("last 2 version", "> 1%"))
  //  .pipe(cssFilter.restore())  //grab the rest of the files again
  //  .pipe(assets.restore()) //not sure
    .pipe(useref()) //plug everything in
    .pipe(gulp.dest('build'))  //output to the build folder
    .pipe(connect.reload()); //restart the server
});

gulp.task('favicon', function () {
  return gulp.src('app/favicon.ico')
    .pipe(changed('build'))
    .pipe(gulp.dest('build'));
});

gulp.task('fonts', [], function () {
  gulp.src('app/bower_components/bootstrap/fonts/*')
    .pipe(changed('build/fonts'))
    .pipe(notify({
      title: 'Fonts copied',
      message: 'Job has finished',
      onLast: true
    }))
    .pipe(gulp.dest('build/fonts'));
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

gulp.task('images', function(){
    return gulp.src('app/images/*')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
      }))
      .pipe(gulp.dest('build/images'));
});

gulp.task('prodWatch', function(){
  gulp.watch(sourceFiles, ['buildTest']);      //when you make a change it executes that function in the array
});


/*****
 GULP FUNCTIONS
******/
gulp.task('default', ['setDev','connect', 'devWatch']);
gulp.task('prod', ['setProd','build','connect','prodWatch']);
