var mongoose    = require('mongoose'),
    User = require('../models/User'),
    Game = require('../models/Game');

/*
 * GET home page.
 */

exports.index = function(req, res){
  Game.find({}, function(err, games) {
    res.render('index', { title: 'NodeChess', games: games });
  });
};