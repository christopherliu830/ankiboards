var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const crypto = require('crypto');
const mongoose = require('mongoose');
const UserModel = require('../model/model').UserModel;

router.get('/profile', async (req, res, next) => {
  const {username, email, ankiInfo} = await UserModel.findById(req.user._id).lean().exec();
  res.status(200).json({username, email, ankiInfo});
});

router.get('/add-client', async (req, res, next) => {
  const model = mongoose.model('OAuthClient');
  if (req.user.client ) return res.status(200).send({clientId: req.user.client.id});

  const id = crypto.randomBytes(32).toString('hex');
  const secret = crypto.randomBytes(32).toString('hex');
  const client = await model.create({
    id: id,
    secret: secret,
  });
  req.user.client = client;
  await req.user.save();
  res.status(201).send({clientId: id});
  // const id = req.user.firebaseUid;
  // if (req.user.apiKey) return res.status(200).send({apiKey: req.user.apiKey});
  // try {
    // const customToken = await admin.auth().createCustomToken(id);
    // req.user.apiKey = customToken;
    // await req.user.save();
    // res.status(201).send({apiKey: customToken});
  // } catch (e) {
    // console.log(e);
    // res.status(500).send(e);
  // }
});

router.get('/profile-info', async (req, res, next) => {
  const user = req.user;
  res.status(200).send(user.ankiInfo);
})


module.exports = router;
