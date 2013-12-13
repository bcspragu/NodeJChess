var mongoose    = require('mongoose'),
    User = require('../models/User'),
    Game = require('../models/Game');

/*
 * GET home page.
 */

//Game index
exports.index = function(req, res){
  //Find all incomplete (active) games
  Game.find({completed: false}).populate('white').populate('black').sort('name').limit(100).exec(function(err, games) {
    res.render('game_index', { title: 'NodeChess', games: games });
  });
};
