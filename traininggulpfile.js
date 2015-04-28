var gulp = require('gulp'),
  gutil = require('gulp-util'),
  coffee = require('gulp-coffee'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  compass = require('gulp-compass'),
  connect = require('gulp-connect'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  minifyHtml = require('gulp-minify-html'),
  jsonMinify = require('gulp-jsonminify'),
  minifyCss = require('gulp-minify-css');



var env=process.env.NODE_ENV || 'development',      //then declare all of the sources conditionally
  coffeeSources,
  sassSources,
  htmlSources,
  jsonSources,
  jsSources,
  outputDir,
  sassStyle;

//make assignments to everything
if(env==='production'){
  outputDir='builds/production';
  sassStyle='compressed';
} else{
  outputDir='builds/development';
  sassStyle='expanded';

}

coffeeSources=['components/coffee/*.coffee'];
sassSources=['components/sass/style.scss'];
htmlSources=[outputDir+'/*.html'];
jsonSources=[outputDir+'/*.json'];
jsSources = [
  //'components/scripts/*.js'
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];


gulp.task('log', function() {
  gutil.log(env);
  gutil.log(outputDir);
  gutil.log(sassStyle);
});

gulp.task('coffee', function(){
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true})     //compiles the js w/o a safety wrapper
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){     //array is adding dependencies
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env==='production', uglify()))
    .pipe(gulp.dest(outputDir+'/js'))
    .pipe(connect.reload());    //need to reload once you change a file
});

gulp.task('compass', function(){
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: outputDir + '/images',
      style: 'compressed'
    })
      .on('error', gutil.log))
    //.pipe(minifyCss())
    .pipe(gulp.dest(outputDir+'/css'))
    .pipe(connect.reload());     //need to reload once you change a file
});

gulp.task('watch', function(){
  gulp.watch(coffeeSources, ['coffee']);      //when you make a change it executes that function in the array
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/js/*.json', ['json']);
});

gulp.task('connect', function(){        //fires up a server
  connect.server({
    root: outputDir,
    livereload:true
  });
});

gulp.task('html', function(){
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env==='production', minifyHtml()))
    .pipe(gulpif(env==='production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

gulp.task('json', function(){
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env==='production', jsonMinify()))
    .pipe(gulpif(env==='production', gulp.dest('builds/production/js')))
    .pipe(connect.reload())
});

gulp.task('default', ['log', 'coffee', 'js', 'compass', 'html', 'json', 'connect', 'watch']);
