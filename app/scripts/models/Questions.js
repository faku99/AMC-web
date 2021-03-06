'use strict';

var mongoose = require('mongoose');

/*
 * Schéma MongoDB pour les questions.
 *
 *  title   :   Titre de la question.
 *  author  :   Auteur de la question.
 *  public  :   'true' si la question est visible par tout le monde, 'false' sinon.
 *  date    :     La date à laquelle a été créée la question.
 *  seconds :   Les secondes écoulées depuis le 1 janvier 1970. Permet de trier
                  les questions convaneblement.
 *  tags    :   Les tags de la question.
 */
var QuestionSchema = new mongoose.Schema({
  title       : String,
  author      : String,
  public      : Boolean,
  plaincDate  : String,
  cDate       : Date,
  plainmDate  : String,
  mDate       : Date,
  tags        : [String],
  type        : String,
  answers     : [
    {
      title   : String,
      correct : Boolean,
      points  : Number
    }
  ]
});

QuestionSchema.methods.delete = function() {
  this.remove();
};

mongoose.model('Question', QuestionSchema);
