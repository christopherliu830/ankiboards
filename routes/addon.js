
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ReviewEntry = require('../model/model').ReviewEntry;

router.use( async (req, res, next) => {
  // Put the user in body
  req.user = await mongoose.model('UserModel').findById(res.locals.oauth.token.user._id);
  next();
})

router.post('/sync', async (req, res, next) => {
  const user = req.user;
  console.log(user.username, 'is syncing');
  const { lastSynced, ...other } = req.body;
  req.user.ankiInfo = other;
  req.user.lastSynced = lastSynced;
  req.user.markModified('ankiInfo');
  console.log(req.user.ankiInfo);
  await user.save();
  res.status(200).send("Success");
});

router.get('/meta', async (req, res, done) => {
  try {
    const body = {
      lastSynced: req.user.ankiInfo.lastSynced ? req.user.ankiInfo.lastSynced: 0,
      uid: req.user._id,
    }
    res.send(body);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
})

module.exports = router;