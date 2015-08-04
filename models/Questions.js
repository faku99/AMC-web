var mongoose = require('mongoose');

/*
 * Schéma MongoDB pour les questions.
 *
 *  title   :   Titre de la question.
 *  author  :   Auteur de la question.
 *  public  :   'true' si la question est visible par tout le monde, 'false' sinon.
 *  date    :     La date à laquelle a été créée la question.
 *  tags    :   Les tags de la question.
 */
var QuestionSchema = new mongoose.Schema({
  title: String,
  author: String,
  public: Boolean,
  date: String,
  tags: [{ type: String }]
});

mongoose.model('Question', QuestionSchema);
