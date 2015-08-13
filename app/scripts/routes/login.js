'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');

router.get('/', function(req, res) {
  res.json({ title: 'Coucou Express' });
});

/*router.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, application/x-www-form-urlencoded');
    next();
});*/

router.post('/', function(req, res, next) {
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

module.exports = router;
