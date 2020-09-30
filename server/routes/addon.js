
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.use( async (req, res, next) => {
  // Put the user in body
  req.user = await mongoose.model('UserModel').findById(res.locals.oauth.token.user._id);
  next();
})
router.post('/sync', async (req, res, next) => {
  const user = req.user;
  console.log(user.username, 'is syncing');

  user.ankiInfo.revlog.concat(req.body.revlog);
  user.ankiInfo.lastSynced = req.body.time;
  user.markModified('ankiInfo');
  await user.save();

  res.status(200).send("Success");
});

router.get('/meta', async (req, res, done) => {
  try {
    await req.user.save();
    const body = {
      lastSynced: req.user.ankiInfo.lastSynced,
    }
    console.log(body);
    res.send(body);
  } catch(e) {
    console.log(e);
    res.send(500);
  }
})

module.exports = router;