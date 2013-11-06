var mongoose    = require('mongoose'),
    User = require('../models/User'),
    Game = require('../models/Game');

exports.create_game = function(req, res) {
  var post = req.body;
  var game = new Game({name: post.name});
  game.save(function (err, user) {
    if (err)
      res.send('An error has occurred');
    else {
      res.redirect('/');
    }
  });
}

exports.show = function(req, res) {
  res.render('game', { title: 'NodeChess - Game' });
}