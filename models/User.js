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

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}