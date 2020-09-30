
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

module.exports = router;