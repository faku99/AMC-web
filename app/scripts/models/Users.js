'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

/*
 * Schéma MongoDB pour les utilisateurs
 *
 * username : Nom d'utilisateur.
 * hash     : Hashage du mot de passe.
 * salt     : Sel utilisé pour les hashage du mot de passe.
 */
var UserSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  hash: String,
  salt: String
});

/* Crypte le mot de passe avec un sel aléatoire */
UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

/* Vérifie que le mot de passe entré et le mot de passe enregistré concordent */
UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

/* Génère un token d'authentification pour l'utilisateur */
UserSchema.methods.generateJWT = function() {
  //On souhaite que le token expire au bout de 60 jours
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, config.secretKey);
};

mongoose.model('User', UserSchema);
