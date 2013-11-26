var mongoose    = require('mongoose'),
    User = require('../models/User');

/*
 * application
 */

 function create_account_checks(username,password) //Checks for bad words + username length + password length
 {
   var return_string = "good";
   //My friend is fond of poop, had to add that one there
   var bad_words = ["penis","vagina","fuck","nigger","douche","faggot","shit","dick","pussy","asshole","crap","cunt","poop"];

   if(!(username.length >= 5 && username.length<=20))
    return_string = "bad_username_length";

   if(!(password.length >= 5 && password.length<=20))
    return_string = "bad_password_length";

   for(var x=0;x<bad_words.length;x++)
   {
    if(username.toLowerCase().indexOf(bad_words[x])>=0)
    {
      return_string = "bad_username";
      break;
    }
   }

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
          res.redirect('/games/');
        }
        else
          res.send('Bad Password');
      });
    } else {
      res.send('Bad username');
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
          res.send('Username already taken');
        else {
          req.session.user_id = user._id;
          res.redirect('/');
        }
      });
      break;
    case "bad_password_length":
      res.send('Passwords must be between 5-20 chars');
      break;
    case "bad_username":
      res.send("Our site is family friendly! Please change your username.");
      break;
    case "bad_username_length":
      res.send("Usernames must be between 5-20 chars");
  }
};

exports.logout = function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
};
