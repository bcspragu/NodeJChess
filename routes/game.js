var mongoose    = require('mongoose'),
    User = require('../models/User'),
    Game = require('../models/Game');

exports.create_game = function(req, res) {
  var post = req.body;
  var game = new Game({name: post.name});
  if (post.player == "white")
    game.white = res.locals.current_user._id
  if (post.player == "black")
    game.black = res.locals.current_user._id
  game.save(function (err, g) {
    if (err)
      res.send('An error has occurred');
    else {
      res.redirect('/game/'+g._id);
    }
  });
}

exports.show = function(req, res) {
  console.log(req.params);
  Game.findById(req.params.id, function(err, g) {
    res.locals.game = g;
    User.findById(g.white, function(err, user1) {
      res.locals.white = user1;
      User.findById(g.black, function(err, user2) {
        res.locals.black = user2;
        res.render('game', { title: 'NodeChess - Game' });
      });
    });
  });
}