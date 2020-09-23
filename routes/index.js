const express = require('express');
const router = express.Router();
const admin = require('firebase-admin')
const UserModel = require('../model/model').UserModel;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/test', async function(req, res) {
  console.log(await UserModel.find());
  const random = require('crypto').randomBytes(48, (err, buffer) => {
    var token = buffer.toString('hex');
    console.log(token);
    new UserModel({username: token, firebaseUid: token}).save()
      .then(() => res.status(201).json({message: 'Created'}))
      .catch(err => console.log(err))
  })
})

router.post('/signup', async (req, res, next) => {
  const { username, password, email } = req.body;
  admin.auth().createUser({
    email,
    displayName: username,
    password: password,
  })
    .then(userRecord => {
      return new UserModel({
        username: username, firebaseUid: userRecord.uid
      }).save();
    })
    .then(() => {
      console.log('Successful');
      res.status(201).send();
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', {session: false}, async (err, user, info) => {
    try {
      if (err || !user) {
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
  UserModel.find({username: re}, 'username').limit(5).lean().exec((err, users) => {
    res.status(200).json(users);
  })
});

router.post('/search-by-username', (req, res, next) => {
  const { query } = req.body;
  UserModel.findOne({username: query}, 'username').lean().exec((err, user) => {
    if (err) return res.status(500);
    res.status(200).json(user);
  })
});

router.get('/user/:id', async (req, res, next) => {
  UserModel.findById(req.params.id, 'username ankiInfo').exec((err, user) => {
    if (err) return res.status(500).send("Error occurred finding user");
    console.log(user);
    res.status(200).json(user);
  })
});

module.exports = router;