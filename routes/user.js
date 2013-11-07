var mongoose    = require('mongoose'),
    User = require('../models/User');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  User.find({}, function(err, users) {
    res.render('user_index', { title: 'UserList', users: users });
  });
};