var express = require('express');
var router = express.Router();
const UserModel = require('../model/model').UserModel;

router.get('/profile', async (req, res, next) => {
  const {username, email, ankiInfo} = await UserModel.findById(req.user._id).lean().exec();
  res.status(200).json({username, email, ankiInfo});
});

router.post('/profile-name', async (req, res, next) => {
  const name = req.body.username;
  UserModel.findById({_id: req.user._id}, (err, user) => {
    user.username = name;
    user.save()
      .then(() => {
        res.status(200).send("Success");
      });
  })
})

module.exports = router;
