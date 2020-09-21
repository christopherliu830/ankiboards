var express = require('express');
var router = express.Router();
const UserModel = require('../model/model').UserModel;

router.get('/profile', async (req, res, next) => {
  const {username, email, ankiInfo} = await UserModel.findById(req.user._id).lean().exec();
  res.json({username, email, ankiInfo});
});

module.exports = router;
