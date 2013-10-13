var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    index: {unique: true}
  },
  password: {
    type: String,
    index: true
  }
});

module.exports = mongoose.model('User', UserSchema);