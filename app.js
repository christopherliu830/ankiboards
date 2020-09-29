const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const secureRouter = require('./routes/private');
const oauthRouter = require('./routes/oauth');
const cors = require('cors');
const config = require('./config.json')
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const OAuth2Server = require('express-oauth-server');

const app = express();

// Initialise firebase admin tools
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: config.firebase.DATABASE_URL,
})

//Connect to mongodb database
mongoose.connect(`mongodb+srv://${config.mongodb.USER}:${config.mongodb.KEY}@cluster0.0cef9.mongodb.net/${config.mongodb.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

// view engine setup
corsOptions = {
  origin: ["https://ankiboards.com", /localhost/],
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', oauthRouter);
app.use('/', indexRouter);
app.use('/', require('./auth/firebase-token'), secureRouter);

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
