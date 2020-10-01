
const express = require('express');
const router = express.Router();
const OAuth2Server = require('express-oauth-server');
const mongoose = require('mongoose');
const addonRoutes = require('./addon');

// Initialize auth token server
const oauthServer = require('../auth/server');

const handler = {
  handle: (req, res) => {
    return req.user ? req.user : null;
  }
}

router.post('/authorize', require('../auth/firebase-token'), oauthServer.authorize({authenticateHandler: handler}))

router.post('/token', oauthServer.token());

module.exports = router;