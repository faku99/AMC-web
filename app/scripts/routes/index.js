'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  return res.json('It seems to be working.');
});

module.exports = router;
