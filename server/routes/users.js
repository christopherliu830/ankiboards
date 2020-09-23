var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const UserModel = require('../model/model').UserModel;

router.get('/profile', async (req, res, next) => {
  const {username, email, ankiInfo} = await UserModel.findById(req.user._id).lean().exec();
  res.status(200).json({username, email, ankiInfo});
});

router.post('/profile-name', async (req, res, next) => {
  const name = req.body.username;
  admin.auth().updateUser(req.user.firebaseUid, {displayName: name})
    .then(() => {
      req.user.username = name;
      req.user.save();
    })
    .then(() => {
      res.status(200).send("Success");
    })
    .catch(err => res.status(500).send(err));
})

module.exports = router;
