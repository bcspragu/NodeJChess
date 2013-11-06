var mongoose = require("mongoose");

var GameSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  private: {
    type: Boolean
  },
  white: {
    type: String,
    index: true
  },
  black: {
    type: String,
    index: true
  }
});

module.exports = mongoose.model('Game', GameSchema);