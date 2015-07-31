var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
  title: String,
  author: String,
  public: Boolean
});

mongoose.model('Question', QuestionSchema);
