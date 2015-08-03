var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
  title: String,
  author: String,
  public: Boolean,
  tags: [{ type: String }]
});

mongoose.model('Question', QuestionSchema);
