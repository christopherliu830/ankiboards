const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('../model/model');

/* GET home page. */
router.get('/', function(req, res) {
  res.send('this is the api');
});

router.post('/signup', async (req, res, next) => {
  const { email, username, password } = req.body;
  await UserModel.create({email, username, password}, (err, user) => {
    if (err) return res.status(500).json({message: 'Error creating user'});
    res.status(200).json({
      message : 'Signup successful',
    });
  });
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', {session: false}, async (err, user, info) => {
    try {
      if (err || !user) {
        console.log(info);
        return res.status(404).send('User Not Found');
      }
      req.login(user, { session : false }, async error => {
        if (error) return next(error);
        const body = { _id : user._id, email : user.email, username : user.username};
        const token = jwt.sign({payload:body}, 'top_secret');
        const [ header, payload, signature ] = token.split('.');
        res.cookie('header.payload', `${header}.${payload}`, {sameSite: true, secure: true});
        res.cookie('signature', signature, {sameSite: true, secure: true, httpOnly: true});
        res.cookie('test', 'hi');
        res.send({token: token});
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post('/search', (req, res, next) => {
  const { query } = req.body;
  const re = new RegExp('^' + query);
  UserModel.find({username: re}).limit(5).lean().exec((err, users) => {
    const ret = users.map(user => { return {username: user.username}})
    res.status(200).json(ret);
  })
});

module.exports = router;