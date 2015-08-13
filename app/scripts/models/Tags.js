var mongoose = require('mongoose');

/*
 * Schéma MongoDB pour les tags.
 *
 * name : Nom du tag.
 */
var TagSchema = new mongoose.Schema({
  name: String,
});

mongoose.model('Tag', TagSchema);
