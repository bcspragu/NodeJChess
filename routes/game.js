var mongoose    = require('mongoose'),
    User = require('../models/User'),
    Game = require('../models/Game');

var form_helpers = require('../helpers/form_helpers.js');

exports.create_game = function(req, res) {
  var post = req.body;
  var game = new Game({name: post.name});

/* Couldn't get this working, will look at it tomorrow"
  if((!form_helpers.length_between(Game.name,5,20)) || form_helpers.contains_bad_word(Game.name))
    res.send('Either the game name is too short or too long, or contains bad words. Please change and try again. Game names should be inbetween 5 and 20 characters.');
*/
  var white, black;
  if (post.player == "w"){
    game.white = res.locals.current_user._id;
    white = res.locals.current_user;
  }
  if (post.player == "b"){
    game.black = res.locals.current_user._id;
    black = res.locals.current_user;
  }
  //Default to a regular game
  game.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  game.save(function (err, g) {
    if (err)
      res.send('An error has occurred');
    else {
      res.redirect('/games/'+g._id);
    }
  });

  app.render('game_row',{game: game, white: white, black: black},function(err,html){
    io.sockets.emit('create', {row: html});
  });
}

exports.show = function(req, res) {
  Game.findById(req.params.id).populate('white').populate('black').exec(function(err, g) {
    res.locals.game = g;
    res.render('game', { title: 'NodeChess - Game' });
  });
}

exports.join = function(req,res) {
  var post = req.body;
  Game.findById(req.params.id).populate('white').populate('black').exec(function(err, game) {
    if (post.color == "w" && !game.white && !game.completed)
      game.white = res.locals.current_user._id;
    if (post.color == "b" && !game.black && !game.completed)
      game.black = res.locals.current_user._id;
      game.save(function(err, g) {
      if (err)
        res.send('An error has occurred');
      else {
        res.redirect('/games/'+g._id)
        res.locals.game = g;
        res.render('game', { title: 'NodeChess - Game' });
      }
    });
  });
  io.sockets.emit(req.params.id+'/join', {color: post.color, name: res.locals.current_user.name, id: req.params.id});
}

exports.leave = function(req, res) {
  var post = req.body;
  Game.findById(req.params.id).populate('white').populate('black').exec(function(err, game) {
    if (game.white && res.locals.current_user.id == game.white._id && !game.completed)
      game.white = undefined;
    if (game.black && res.locals.current_user.id == game.black._id && !game.completed)
      game.black = undefined;
    game.save(function(err, g) {
      if (err)
        res.send('An error has occurred');
      else {
        res.redirect('/games/'+g._id)
        res.locals.game = g;
        res.render('game', { title: 'NodeChess - Game' });
      }
    });
  });
}

exports.move = function(req,res) {
  var post = req.body;
  Game.findById(req.params.id).populate('white').populate('black').exec(function(err, game) {
    //Make sure nobody is trying anything sneaky
    if((post.move.color == 'b' && res.locals.current_user.id == game.black.id) || (post.move.color == 'w' && res.locals.current_user.id == game.white.id)){
      game.past_fen.push(game.fen);
      game.fen = post.fen;
      game.save(function(err, g) {
        if (err){
          res.send(500);
          return;
        }
      });
    }
  });
  io.sockets.emit(req.params.id+'/move', {fen: post.fen, move: post.move});
  res.send(200);
}

exports.info = function(req, res) {
  Game.findById(req.params.id).populate('white').populate('black').exec(function(err, g) {
    var player_color = [];
    if(g.white && g.white._id.toHexString() === res.locals.current_user._id.toHexString()){
      player_color.push('w');
    }
    if(g.black && g.black._id.toHexString() === res.locals.current_user._id.toHexString()){
      player_color.push('b');
    }
    else{
      player_color.push('s');
    }
    res.json({player_color: player_color, fen: g.fen, env: app.get('env')});
  });
}

exports.super_spectator = function(req,res) {
  Game.find({}).populate('white').populate('black').sort('name').exec(function(err,games){
    res.render('super_spectator', {title: 'NodeChess', games: games})
  });
}

exports.game_over = function(req, res) {
  Game.findById(req.params.id).populate('white').populate('black').exec(function(err, game) {
    //Make sure nobody is trying anything sneaky
    if(!game.completed){
      game.completed = true;
      if(game.fen.split(' ')[1] == 'w'){ //White won
        var white = game.white;
        var black = game.black;
        white.games_played += 1;
        black.games_played += 1;
        white.wins += 1;
        black.losses += 1;
        white.save();
        black.save();
      }else{ //Black won
        var white = game.white;
        var black = game.black;
        white.games_played += 1;
        black.games_played += 1;
        black.wins += 1;
        white.losses += 1;
        white.save();
        black.save();
      }
      game.save(function(err, g) {
        if (err){
          res.send(500);
          return;
        }
      });
    }
  });
  res.send(200);
}
