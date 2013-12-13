var mongoose    = require('mongoose'),
    User = require('../models/User');

var form_helpers = require('../helpers/form_helpers.js');

/*
 * application
 */

 function create_account_checks(username,password) //Checks for bad words + username length + password length
 {
   var return_string = "good";

   if(!form_helpers.length_between(username,5,15))
    return_string = "bad_username_length";

   if(!form_helpers.length_between(password,5,20))
    return_string = "bad_password_length";

   if(form_helpers.contains_bad_word(username))
    return_string = "bad_username";
    

  return return_string;
 }

//Render login page
exports.login = function (req, res) {
  res.render('login', { title: 'NodeChess - Login' });
};

//Attempt to login with username, password
exports.attempt_login = function (req, res) {
  var post = req.body;
  //Find user with given username
  User.findOne({name: post.user}, function(err, user) {
    //User found
    if (user != undefined) {
      //Compare given password with stored (hashed) password
      user.comparePassword(post.password, function(err, isMatch) {
        //If it matches
        if (isMatch) {
          //Give them an id and send them on their way
          req.session.user_id = user._id;
          res.json({redirect: '/games/'});
        }
        //If it doesn't, display error message
        else
          res.json({error: 'Bad Password'});
      });
    }
    //No user found, display error message
    else {
      res.json({error: 'Bad Username'});
    }
  })
};

//Creating a new account
exports.create_account = function(req, res) {
  var post = req.body;
  var check_string = create_account_checks(post.user,post.password); //Makes sure password and username are of certain length + no bad words

  switch(check_string) {
    //if everything is a-okay
    case "good":
      //Create a new user
      var user = new User({name: post.user, password: post.password});
      //Save the user
      user.save(function (err, user) {
        if (err)
          res.json({error: 'Username already taken'});
        else {
          //Give them an id and send them on their way
          req.session.user_id = user._id;
          res.json({redirect: '/'});
        }
      });
      break; //Everything below is various form validation errors
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

//Simple, delete the user id from their cookie and redirect them to the login page
exports.logout = function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
};
