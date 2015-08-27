'use strict';

var express = require('express');
var router = express.Router();

var rep = require('replace');
var fs = require('fs-extra');

var latinize = require('latinize');

var latexDir = __dirname + '/../../latex/';

function replace(regex, replacement, fileName) {
  rep({
    regex       : regex,
    replacement : replacement,
    paths       : [latexDir + fileName],
    silent      : true
  });
}

function restore(fileName) {
  fs.copy(latexDir + 'models/' + fileName, latexDir + fileName, function(err) {
    if (err) { return console.log('An error occured : ', err); }

    console.log(fileName + ' restored.');
  });
}

function generateQuestions(req, fileName) {
  var toReturn = '';

  for(var i in req.body.questions) {
    var identifier = latinize(req.body.questions[i].title).replace(/ /gi, '-');
    var qString = '\\begin{question}{' + identifier + '}\n';
    qString += '  ' + req.body.questions[i].title + '\n  \\begin{reponses}';
    for(var j in req.body.questions[i].answers) {
      qString += req.body.questions[i].answers[j].correct ? '\n    \\bonne{' : '\n    \\mauvaise{';
      qString += req.body.questions[i].answers[j].title + '}';
    }
    qString += '\n  \\end{reponses}\n';
    qString += '\\end{question}\n\n';
    toReturn += qString;
  }

  replace('__QUESTIONS__', toReturn, fileName);
}

function generalReplacements(req, fileName) {
  replace('__NUM_EXEMPLAIRES__', req.body.exemplaires, fileName);
  replace('__MATIERE__', req.body.matiere, fileName);
  replace('__DATE__', req.body.date, fileName);
  replace('__DURATION__', req.body.duration, fileName);
  replace('__RULES__', req.body.rules, fileName);
}

router.post('/simple.tex', function(req, res) {
  var simple = 'simple.tex';

  generalReplacements(req, simple);
  generateQuestions(req, simple);
  res.download(latexDir + simple);

  restore(simple);
});

module.exports = router;
