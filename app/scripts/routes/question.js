'use strict';

/**
 * ngdoc
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Question = mongoose.model('Question');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var moment = require('moment');

router.get('/all', function(req, res, next) {
  Question.find(function(err, questions) {
    if (err) { return next(err); }

    res.json(questions);
  });
});

router.post('/create', auth, function(req, res, next) {
  if (!req.body.title || req.body.title === '') {
    return res.status(400).json({
      message: 'Veuillez donner un titre à votre question'
    });
  }

  var question = new Question(req.body);

  question.author     = req.payload.username;
  question.plaincDate = moment().format('DD/MM/YY [à] HH:mm');
  question.plainmDate = '';
  question.cDate      = Date.now();
  question.mDate      = null;
  question.public     = false;

  question.save(function(err, question) {
    if (err) { return next(err); }

    return res.json(question);
  });
});

router.post('/edit', function(req, res, next) {
  Question.update({_id: req.body._id}, {
    title       : req.body.title,
    tags        : req.body.tags,
    answers     : req.body.answers,
    plainmDate  : moment().format('DD/MM/YY [à] HH:mm'),
    mDate       : Date.now()
  }).then(function() {
    res.json(req.body);
  }, function(err) {
    return next(err);
  });
});

router.get('/:question', function(req, res) {
  res.json(req.question);
});

router.put('/:question/remove', function(req, res, next) {
  req.question.delete(function(err, question) {
    if (err) { return next(err); }

    res.json(question);
  });
});

router.param('question', function(req, res, next, id) {
  var query = Question.findById(id);

  query.exec(function(err, question) {
    if (err) { return next(err); }
    if (!question) {
      return next(new Error('Impossible de trouver la question demandée'));
    }

    req.question = question;
    return next();
  });
});

module.exports = router;
