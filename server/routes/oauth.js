
var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const Request = require('oauth2-server').Request;
const Response = require('oauth2-server').Response;
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
const OAuthClientModel = require('../model/model').OAuthClientModel;
const UserModel = require('../model/model').UserModel;

router.get('/create', async (req, res, next) => {
  const id = uuidv4();
  const bytes = await crypto.randomBytes(32);
  const chris = await UserModel.findOne({username: 'chris'});
  const oAuthClient = await OAuthClientModel.create({ 
    clientId: id,
    clientSecret: bytes.toString('hex'),
  });
  chris.oauth2clients.push(oAuthClient);
  chris.save();
  console.log(chris.toJSON());
  res.status(200).send(id);
})

// router.post('/token', (req, res, next) => {
//   const request = new Request(req);
//   const response = new Response(res);
//   console.log(request.body.username);
//   req.app.oauth.token()(request, response).then(token => {
//     res.status(200).send({
//       accessToken: token.accessToken,
//       accessTokenExpiresAt: token.accessTokenExpiresAt,
//     });
//   })
//   .catch(err => err);
// });

router.post('/authorize', async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);
  req.app.oauth.authorize(request, response).then(token => {
    res.status(200).send({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
    });
  })
  .catch(err => err);

})

module.exports = router;
