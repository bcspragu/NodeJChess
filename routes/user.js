var mongoose    = require('mongoose'),
    User = require('../models/User');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  User.find({}, function(err, users) {
    res.render('user_index', { title: 'UserList', users: users.sort( {elo: -1}) });
  });
};

exports.user_page = function(req, res) {
	User.findOne({ name: req.params.name }, function(err, user){
		if(err || user===null){
			res.json(404, '404');
		}
		else{
			res.render('user_page', { title: 'User Page', user: user });
		}
	});
};