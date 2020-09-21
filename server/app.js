var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var oauthRouter = require('./routes/oauth');
var cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const OAuth2Server = require('oauth2-server');
const {Request, Response} = require('oauth2-server');
const OAuthModel = require('./model/oauth2model');

var app = express();

mongoose.connect('mongodb://127.0.0.1:27017/passport-jwt', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./auth/auth');

app.oauth = new OAuth2Server({
  model: OAuthModel,
});


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', oauthRouter);
app.use('/', indexRouter);
app.use('/', passport.authenticate('jwt', {session: false}), usersRouter);
app.use('/ass2', (req, res, next) => {
  console.log("hello");
  const request = new Request(req);
  const response = new Response(res);
  req.app.oauth.authenticate(request, response, () => {
  })
  .then(token => next());
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
