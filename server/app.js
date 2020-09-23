var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var secureRouter = require('./routes/users');
var cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://ankiboards-f7b90.firebaseio.com",
})

var app = express();

mongoose.connect('mongodb://127.0.0.1:27017/ankiboards', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

// view engine setup
frontendCors = {
  origin: /ankiboards.com/,
  credentials: true,
}

apiCors = {
  origin: true,
  credentials: true
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors({
  origin: ["https://ankiboards.com", /localhost/],
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/', cors(frontendCors), require('./auth/firebase-token'), secureRouter);

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
