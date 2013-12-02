var mongoose    = require('mongoose'),
    User = require('../models/User');

var form_helpers = require('../helpers/form_helpers.js');

/*
 * application
 */

 function create_account_checks(username,password) //Checks for bad words + username length + password length
 {
   var return_string = "good";

   if(!form_helpers.length_between(username,5,20))
    return_string = "bad_username_length";

   if(!form_helpers.length_between(password,5,20))
    return_string = "bad_password_length";

   if(form_helpers.contains_bad_word(username))
    return_string = "bad_username";
    

  return return_string;
 }

exports.login = function (req, res) {
  res.render('login', { title: 'NodeChess - Login' });
};

exports.attempt_login = function (req, res) {
  var post = req.body;
  User.findOne({name: post.user}, function(err, user) {
    if (user != undefined) {
      user.comparePassword(post.password, function(err, isMatch) {
        if (isMatch) {
          req.session.user_id = user._id;
          res.json({redirect: '/games/'});
        }
        else
          res.json({error: 'Bad Password'});
      });
    } else {
      res.json({error: 'Bad Username'});
    }
  })
};

exports.create_account = function(req, res) {
  var post = req.body;
  var check_string = create_account_checks(post.user,post.password); //Makes sure password and username are of certain length + no bad words

  switch(check_string) {
    case "good":
      var user = new User({name: post.user, password: post.password});
      user.save(function (err, user) {
        if (err)
          res.json({error: 'Username already taken'});
        else {
          req.session.user_id = user._id;
          res.json({redirect: '/'});
        }
      });
      break;
    case "bad_password_length":
      res.json({error: 'Passwords must be between 5-20 chars'});
      break;
    case "bad_username":
      res.json({error: "Our site is family friendly! Please change your username."});
      break;
    case "bad_username_length":
      res.json({error: "Usernames must be between 5-20 chars"});
  }
};

exports.logout = function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
};

exports.lobby_message = function (req, res) {
  io.sockets.emit('lobby_message', {name: res.locals.current_user.name, message: req.body.message});
  res.send(200);
}
