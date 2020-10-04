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
  const OAuthClientModel = mongoose.model('OAuthClient');
  if (req.user.client) {
    const client = await OAuthClientModel.findById(req.user.client).lean();
    return res.status(200).send({ clientId: client.id, clientSecret: client.secret });
  }

  const id = crypto.randomBytes(32).toString('hex');
  const secret = 'SECRET' + crypto.randomBytes(32).toString('hex');
  const client = await OAuthClientModel.create({
    id: id,
    secret: secret,
  });
  req.user.client = client._id;
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
    await admin.auth().updateUser(req.user.firebaseUid, { displayName: req.body.username});
    req.user.username = req.body.username;
    req.user.username_lower = req.body.username.toLowerCase();
    await req.user.save();
    res.status(200).send({message: "Success"});
  } catch(e) {
    res.status(500).send({error: e.toString()});
  }
})

module.exports = router;
