
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
  req.user.ankiInfo.lastSynced = req.body.time;
  req.user.markModified('ankiInfo');
  await user.save();
  const docs = req.body.revlog.map(r => ({
    id: r[0],
    cid: r[1],
    ease: r[2],
    ivl: r[3],
    lastIvl: r[4],
    factor: r[5],
    time: r[6],
    type: r[7],
    userid: req.user._id,
  }))
  ReviewEntry.insertMany(docs);
  res.status(200).send("Success");
});

router.get('/meta', async (req, res, done) => {
  try {
    const body = {
      lastSynced: req.user.ankiInfo.lastSynced,
      uid: req.user._id,
    }
    res.send(body);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
})

module.exports = router;