var mongoose    = require('mongoose'),
    User = require('../models/User');
    Game = require('../models/Game');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  User.find({}, function(err, users) {
    res.render('user_index', { title: 'UserList', users: users.sort( {elo: -1}) });
  });
};

exports.user_page = function(req, res) {
	var gameList = [];

	User.findOne({ name: req.params.name }, function(err, user){
		if(err || user===null){
			res.json(404, '404');
		}
		else{
			Game.find({black:user._id,completed:true}).populate('white').populate('black').exec(function(err,black_games)
			{
				gameList.push(black_games);
				Game.find({white:user._id,completed:true}).populate('white').populate('black').exec(function(err,white_games)
				{
					gameList.push(white_games);
					var realGameList = [];
					realGameList = realGameList.concat.apply(realGameList,gameList);
					res.render('user_page', { title: 'User Page', user: user, games: realGameList });
				});
			});
		}
	});
};