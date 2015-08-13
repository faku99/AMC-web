'use strict';

/**
 * ngdoc
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Question = mongoose.model('Question');

var jwt = require('express-jwt');
var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });

router.get('/', function(req, res, next) {
  Question.find(function(err, questions) {
    if(err) { return next(err); }

    res.json(questions);
  });
});

router.post('/', auth, function(req, res, next) {
  if(!req.body.title || req.body.title === '') {
    return res.status(400).json({ message: 'Veuillez donner un titre à votre question '});
  }

  var question = new Question(req.body);
  question.author = req.payload.username;

  question.save(function(err, question) {
    if(err) { return next(err); }

    return res.json(question);
  });
});


/* GET single question */
router.get('/:question', function(req, res) {
  res.json(req.question);
});

router.put('/:question/remove', function(req, res, next) {
  req.question.delete(function(err, question) {
    if(err) { return next(err); }

    res.json(question);
  });
});

router.param('question', function(req, res, next, id) {
  var query = Question.findById(id);

  query.exec(function(err, question) {
    if(err) { return next(err); }
    if(!question) { return next(new Error('Impossible de trouver la question demandée (id: ' + id + ')')); }

    req.question = question;
    return next();
  });
});

module.exports = router;
