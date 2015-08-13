'use strict';

/**
 * ngdoc
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

router.post('/', function(req, res, next) {
   /*var alreadyExists = User.find({username: req.body.username},
     function(err, docs) {
       if (docs.length) {
         return true;
       } else {
         return false;
       }
   });*/

   if (!req.body.username || !req.body.password1 || !req.body.password2) {
     return res.status(400).json({
       message: 'Veuillez remplir tous les champs'
     });
   }
   if (req.body.password1 !== req.body.password2) {
     return res.status(400).json({
       message: 'Les mots de passe ne correspondent pas'
     });
   }
   /*if(alreadyExists) {
     return res.status(400).json({
       message: 'Le nom d\'utilisateur est déjà pris.'
     });
   }*/

   var user = new User();

   user.username = req.body.username;
   user.setPassword(req.body.password1);
   user.save(function(err) {
     if (err) { return next(err); }

     return res.json({token: user.generateJWT()});
   });
 });

module.exports = router;
