const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const {UserModel, ReviewEntry }= require('../model/model');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/signup', async (req, res, next) => {
  const { username, password, email } = req.body;
  try {

    const firebaseRecord = await admin.auth().createUser({
      email,
      displayName: username,
      password: password,
    })

    const model = new UserModel({
      username: username, 
      firebaseUid: firebaseRecord.uid,
      username_lower: username.toLowerCase(),
    })

    await model.save();

    res.status(201).send();

  } catch (e) {
    return res.status(500).send(e);
  }
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
  const user = await UserModel.findOne({
    $or: [
      {_id: req.params.id},
      {username: req.params.id},
    ]
  }).lean();
  res.status(200).send({ankiInfo: user.ankiInfo, username: user.username});
});


module.exports = router;