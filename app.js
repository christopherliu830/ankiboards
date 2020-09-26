var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var secureRouter = require('./routes/private');
var cors = require('cors');
const config = require('./config.json')
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: config.firebase.DATABASE_URL,
})

var app = express();

console.log(`mongodb+srv://${config.mongodb.USER}:${config.mongodb.KEY}@cluster0.0cef9.mongodb.net/${config.mongodb.DB_NAME}?retryWrites=true&w=majority`);
mongoose.connect(`mongodb+srv://${config.mongodb.USER}:${config.mongodb.KEY}@cluster0.0cef9.mongodb.net/${config.mongodb.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});
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
