const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
    try {
      //Save the information provided by the user to the the database
      const user = await UserModel.create({ email, password });
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use(new localStrategy({
  usernameField: 'username',
  passwordField : 'password',
  usernameQueryFields : ['email'],
}, async (name, password, done) => {
  try {
    //Find the user associated with the email provided by the user
    const user = await UserModel.findOne({
      $or: [
        {username: name},
        {email: name},
      ],
    });
    if (!user) {
      //If the user isn't found in the database, return a message
      return done(null, false, { message : 'User not found'});
    }
    const validate = await user.isValidPassword(password);
    if (!validate) {
      return done(null, false, { message : 'Wrong Password'});
    }
    //Send the user information to the next middleware
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const cookieExtractor = function(req) {
  return req && req.cookies ? `${req.cookies['header.payload']}.${req.cookies['signature']}` : null;
}

passport.use(new JWTStrategy({
  secretOrKey : 'top_secret',
  jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
}, async (token, done) => {
  try {
    return done(null, token.payload);
  } catch (error) {
    console.log(error);
    done(error);
  }
}));