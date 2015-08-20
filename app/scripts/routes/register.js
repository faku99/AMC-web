'use strict';

/**
 * ngdoc
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

router.post('/', function(req, res, next) {
   User.find({username: req.body.username}).then(function(docs) {
     var alreadyExists = docs.length >= 1;

     if (!req.body.username || !req.body.password || !req.body.confirmPassword) {
       return res.status(400).json({
         message: 'Veuillez remplir tous les champs'
       });
     }
     if (req.body.password !== req.body.confirmPassword) {
       return res.status(400).json({
         message: 'Les mots de passe ne correspondent pas'
       });
     }
     if(alreadyExists) {
       return res.status(400).json({
         message: 'Le nom d\'utilisateur est déjà pris.'
       });
     }

     var user = new User();

     user.username = req.body.username;
     user.setPassword(req.body.password);
     user.save(function(err) {
       if (err) { return next(err); }

       return res.json({token: user.generateJWT()});
     });
   }, function() {
     return res.status(500).json({message: 'Une erreur est survenue.'});
   });
 });

module.exports = router;
