'use strict';

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
app.use('/', routes);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/question', questionRoute);
app.use('/tags', tagsRoute);

module.exports = app;

app.listen(3000, function() {
  console.log('Started express web server on http://localhost:3000');
});
