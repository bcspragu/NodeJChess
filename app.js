
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

var app = express();
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

app.configure(function(){
  app.use(function(req, res, next){
    var id = mongoose.Types.ObjectId(req.session.user_id);
    User.findById(id, function(err, cur_user) {
      if (cur_user != undefined)
        res.locals.current_user = cur_user;
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
app.get('/', checkAuth, routes.index); //Checks to see if logged in, if they arn't goes to the checkAuth method , if they are go to the gameList
app.get('/users', checkAuth, user.list);
app.post('/create_game', checkAuth, game.create_game)
app.get('/game/:id', checkAuth, game.show)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
