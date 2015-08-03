var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
  name: String,
});

mongoose.model('Tag', TagSchema);
