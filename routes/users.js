var express = require('express');
var router = express.Router();
const UserModel = require('../model/model').UserModel;

router.get('/profile', async (req, res, next) => {
  const {username, email, ankiInfo} = await UserModel.findById(req.user._id).lean().exec();
  res.json({username, email, ankiInfo});
});

router.post('/profile-name', async (req, res, next) => {
  const uid = req.body.firebaseUid;
  const name = req.body.name;
  console.log(name);
  UserModel.findOne({firebaseUid: uid}, (err, user) => {
    user.update({username: name});
    res.status(200).send("Success");
  })
})

module.exports = router;
