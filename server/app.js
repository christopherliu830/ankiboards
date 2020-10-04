const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const secureRouter = require('./routes/private');
const oauthRouter = require('./routes/oauth');
const addonRouter = require('./routes/addon');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const compression = require('compression');

require('dotenv').config();

const app = express();

// Initialise firebase admin tools
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_URL,
})

//Connect to mongodb database
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_KEY}@cluster0.0cef9.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

const oauthServer = require('./auth/server');


// view engine setup
corsOptions = {
  origin: ["https://ankiboards.com", /localhost/],
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: false, limit: '5mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression()) // compress responses
app.use('/oauth', oauthRouter);
app.use('/private', require('./auth/firebase-token'), secureRouter);
app.use('/addon', oauthServer.authenticate(), addonRouter);
app.use('/', indexRouter);

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
