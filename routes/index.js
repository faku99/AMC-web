var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Question = mongoose.model('Question');

var passport = require('passport');
var User = mongoose.model('User');

var jwt = require('express-jwt');
var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });

/* GET questions page */
router.get('/questions', function(req, res, next) {
  Question.find(function(err, questions) {
    if(err) { return next(err); }

    res.json(questions);
  });
});

/* GET single question */
router.get('/questions/:question', function(req, res, next) {
  res.json(req.question);
});

/* POST questions page */
router.post('/questions', auth, function(req, res, next) {
  var question = new Question(req.body);
  question.author = req.payload.username;

  question.save(function(err, question) {
    if(err) { return next(err); }

    res.json(question);
  });
});

/* POST registration page */
router.post('/register', function(req, res, next) {
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
  }

  var user = new User();

  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.save(function(err) {
    if(err) { return next(err); }

    return res.json({ token: user.generateJWT() });
  });
});

/* POST login page */
router.post('/login', function(req, res, next) {
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
  }

  passport.authenticate('local', function(err, user, info) {
    if(err) { return next(err); }

    if(user) {
      return res.json({ token: user.generateJWT() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/* PARAM questions */
router.param('question', function(req, res, next, id) {
  var query = Question.findById(id);

  query.exec(function(err, question) {
    if(err) { return next(err); }
    if(!question) { return next(new Error('Impossible de trouver la question demandée')); }

    req.question = question;
    return next();
  });
});


module.exports = router;
