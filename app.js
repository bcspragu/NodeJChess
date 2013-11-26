
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var game = require('./routes/game');
var application = require('./routes/application');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose'), 
    User = require('./models/User'),
    Game = require('./models/Game');

app = express();
var server = http.createServer(app);
io = require('socket.io').listen(server);

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';
// database
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connected to mongodb");
});

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));  // Our favicon 
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

//If we aren't in development, we're on heroku and need to use long polling
if ('development' != app.get('env')) {
  io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
  });
}

//builds breadcrumbs in nav bar
function buildBreadCrumbs(url) {
  var breadcrumbs = [];
  //splits url
  var url_bits = url.split("/");
  //url_bits[0] is always blank
  //check first part
  if (url_bits[1]) {
    //if it's 'games'...
    if (url_bits[1] == "games") {
      //push a link with the text "Games" leading to "/games/"
      breadcrumbs.push(["Games", "/games/"]);
      //check second part (if first part is "/games/", then second part would be game id)
      if (url_bits[2])
        //add game id
        breadcrumbs.push([url_bits[2].substring(0,8)+"...", "/games/"+url_bits[2]]);
    }
  }
  return breadcrumbs;
}

//run before every request is handled
app.configure(function(){
  app.use(function(req, res, next){
    res.locals.breadcrumbs = buildBreadCrumbs(req.url);
    var id = mongoose.Types.ObjectId(req.session.user_id);
    User.findById(id, function(err, cur_user) {
      //I don't know what this does, I added braces
      if (cur_user != undefined){
        res.locals.current_user = cur_user;
      }
      next();
    });
  });
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.get('/login', application.login); 
app.post('/attempt_login', application.attempt_login);
app.post('/create_account', application.create_account);
app.get('/logout', application.logout); 

//These actions are protected by login system, checkAuth
app.get('/', checkAuth, routes.index);
app.get('/games', checkAuth, routes.index);
app.get('/super_spectator', checkAuth, game.super_spectator);
app.get('/users', checkAuth, user.list);
app.post('/games/create', checkAuth, game.create_game);
app.get('/games/:id', checkAuth, game.show);
app.post('/games/:id/join', checkAuth, game.join);
app.post('/games/:id/move', checkAuth, game.move);
app.post('/games/:id/info', checkAuth, game.info);
app.get('/games/:id/leave', checkAuth, game.leave);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
