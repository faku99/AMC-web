'use strict';

/**
 * ngdoc
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');

router.get('/', function(req, res, next) {
  Tag.find(function(err, tags) {
    if(err) { return next(err); }

    res.json(tags);
  });
});


router.post('/', function(req, res, next) {
  var tag = new Tag(req.body);

  tag.save(function(err, tag) {
    if(err) { return next(err); }

    res.json(tag);
  });
});

router.get('/:tag', function(req, res) {
  res.json(req.tag);
});

router.param('tag', function(req, res, next, name) {
  var query = Tag.find({ name: new RegExp(name, 'i')});

  query.exec(function(err, tag) {
    if(err) { return next(err); }
    if(!tag) { return next(new Error('Impossible de trouver le tag demandé')); }

    req.tag = tag;
    return next();
  });
});

module.exports = router;
