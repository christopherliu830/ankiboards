
const express = require('express');
const router = express.Router();
const OAuth2Server = require('express-oauth-server');
const mongoose = require('mongoose');
const addonRoutes = require('./addon');

// Initialize auth token server
const oauth = new OAuth2Server({
  model: require('../model/authcode')
});

const handler = {
  handle: (req, res) => {
    return req.user ? req.user : null;
  }
}

router.post('/oauth/authorize', require('../auth/firebase-token'), oauth.authorize({authenticateHandler: handler}))

router.post('/oauth/token', oauth.token());

router.use('/', oauth.authenticate(), addonRoutes);

router.post('/sync', oauth.authenticate(), async (req, res, done) => {
  const user = await mongoose.model('UserModel').findById(res.locals.oauth.token.user._id);
  console.log(user.username, 'is syncing');
  user.ankiInfo.reviews = req.body.reviews;
  user.markModified('ankiInfo');
  await user.save();
  console.log(user);
  res.status(200).send("Success");
});

module.exports = router;