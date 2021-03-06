/* jshint node:true */
'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var argv = require('yargs').argv;
var $ = require('gulp-load-plugins')();


gulp.task('styles', function() {
  return gulp.src('app/styles/main.less')
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint());
    //.pipe($.jshint.reporter('jshint-stylish'))
    //.pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jscs());
});

gulp.task('html', ['styles'], function() {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso)
    .pipe($.replace, 'bower_components/bootstrap/fonts', 'fonts');

  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    // .pipe($.cache($.imagemin({
    //   progressive: true,
    //   interlaced: true
    // })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*')
    .concat('bower_components/bootstrap/fonts/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('extras', function() {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('express', ['styles'], function() {
  var serveStatic = require('serve-static');
  var express = require('express');
  var bodyParser = require('body-parser');
  var mongoose = require('mongoose');
  var passport = require('passport');

  require('./app/scripts/models/Questions');
  require('./app/scripts/models/Users');
  require('./app/scripts/models/Tags');
  require('./app/scripts/config/passport');

  if(process.env.HEROKU === 'true') {
    mongoose.connect(process.env.MONGOLAB_URI);
  } else {
    mongoose.connect('mongodb://localhost/AMC-web');
  }

  var app = express();

  app.set('view engine', 'ejs');

  app.use(serveStatic('.tmp'));
  app.use(serveStatic('app'));
  app.use('/bower_components', serveStatic('bower_components'));
  app.use(express.static('app'));
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  /* Routes */
  var routes = require('./app/scripts/routes/index');
  var loginRoute = require('./app/scripts/routes/login');
  var registerRoute = require('./app/scripts/routes/register');
  var questionRoute = require('./app/scripts/routes/question');
  var tagsRoute = require('./app/scripts/routes/tags');
  var examRoute = require('./app/scripts/routes/exam');
  app.use('/', routes);
  app.use('/login', loginRoute);
  app.use('/register', registerRoute);
  app.use('/question', questionRoute);
  app.use('/tags', tagsRoute);
  app.use('/exam', examRoute);

  module.exports = app;

  app.listen(3000, function() {
    console.log('Started express web server on http://localhost:3000');
  });

});

gulp.task('serve', ['wiredep', 'express', 'fonts', 'watch'], function() {
  if (argv.open) {
    require('opn')('http://localhost:3000');
  }
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done);
});

// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;
  var exclude = [
    //'bootstrap',
    //'jquery',
    'es5-shim',
    'json3',
    'angular-scenario'
  ];

  gulp.src('app/styles/*.less')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({exclude: exclude}))
    .pipe(gulp.dest('app'));

  gulp.src('test/*.js')
    .pipe(wiredep({exclude: exclude, devDependencies: true}))
    .pipe(gulp.dest('test'));
});

gulp.task('watch', ['express'], function() {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/**/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/routes/*.js'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.less', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('builddist', ['jshint', 'jscs', 'html', 'images', 'fonts', 'extras'],
  function() {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('build', ['clean'], function() {
  gulp.start('builddist');
});

gulp.task('docs', [], function() {
  return gulp.src('app/scripts/**/**')
    .pipe($.ngdocs.process())
    .pipe(gulp.dest('./docs'));
});
