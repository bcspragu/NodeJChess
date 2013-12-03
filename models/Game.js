var mongoose = require("mongoose"),
    user = require("./User");

var GameSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  private: {
    type: Boolean
  },
  white: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    index: true
  },
  black: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    index: true
  },
  fen: String,
  past_fen: [String],
  completed: {
    type: Boolean,
    default: false
  },
  game_type: String,
  ai_url: String
});

module.exports = mongoose.model('Game', GameSchema);
