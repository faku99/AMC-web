'use strict';

/**
 * ngdoc
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');

router.get('/', function(req, res, next) {
  if(req.query.q) {
    Tag.find({name: new RegExp(req.query.q, 'i')}, function(err, tag) {
      if(err) { return next(err); }

      res.json(tag);
    });
  } else {
    Tag.find(function(err, tags) {
      if (err) { return next(err); }

      res.json(tags);
    });
  }
});

router.post('/', function(req, res, next) {
  Tag.find({name: req.body.name}).then(function(docs) {
    var alreadyExists = docs.length >= 1;

    if (!alreadyExists) {
      var tag = new Tag(req.body);

      tag.save(function(err, tag) {
        if (err) { return next(err); }

        res.json(tag);
      });
    }
  }, function() {
    return res.status(500).json({message: 'Une erreur est survenue.'});
  });
});

module.exports = router;
