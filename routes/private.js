var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const crypto = require('crypto');
const mongoose = require('mongoose');
const {UserModel, ReviewEntry} = require('../model/model');

router.get('/profile', async (req, res, next) => {
  const {username, email, ankiInfo} = await UserModel.findById(req.user._id).lean().exec();
  res.status(200).json({username, email, ankiInfo});
});

router.get('/add-client', async (req, res, next) => {
  const model = mongoose.model('OAuthClient');
  if (req.user.client ) return res.status(200).send({clientId: req.user.client.id, clientSecret: req.user.client.secret});

  const id = crypto.randomBytes(32).toString('hex');
  const secret = 'SECRET' + crypto.randomBytes(32).toString('hex');
  const client = await model.create({
    id: id,
    secret: secret,
  });
  req.user.client = client;
  await req.user.save();
  res.status(201).send({clientId: id, clientSecret: secret});
});

router.get('/profile-info', async (req, res, next) => {
  const user = req.user;
  const reviews = await ReviewEntry.find({userid: user._id});
  res.status(200).send({...user.ankiInfo, revlog: reviews});
})

router.post('/name-change', async (req, res, next) => {
  try {
    await admin.auth().getUser(req.user.firebaseUid, { displayName: req.body.username});
    req.user.username = req.body.username;
    req.user.username_lower = req.body.username.toLowercase();
    await req.user.save();
  } catch(e) {
    res.status(500).send("Error changing display name!");
  }
})

module.exports = router;
