
const express = require('express');
const mongoose = require('mongoose');
const { AnkiInfo, ReviewEntry } = require('../model/model');

const router = express.Router();

router.use( async (req, res, next) => {
  // Put the user in body
  req.user = await mongoose.model('UserModel').findById(res.locals.oauth.token.user._id);
  next();
})

router.post('/sync', async (req, res, next) => {
  try {
    console.log(req.body.count);
    await AnkiInfo.findByIdAndUpdate(req.body.id, {
      heatmap: req.body.heatmap,
      byHour: req.body.byHour,
      count: req.body.count,
    }, {useFindAndModify: false});
    res.status(200).send("Success");
  } catch (e) {
    console.log(e);
    res.status(500).send({error: e.toString()});
  }
});

router.post('/sync/heatmap', async (req, res, next) => {
  try {
    await AnkiInfo.findByIdAndUpdate(req.body.id, {
      heatmap: req.body.heatmap,
    }, {useFindAndModify: false});
    res.status(200).send("Success");
  } catch (e) {
    console.log(e);
    res.status(500).send({error: e.toString()});
  }
});

router.post('/sync/revlog', async(req, res, next) => {
  try {
    const reviews = req.body.revlog.map(r => ({
      id: r[0],
      cid: r[1],
      ease: r[2],
      ivl: r[3],
      lastIvl: r[4],
      factor: r[5],
      time: r[6],
      type: r[7],
    }));
    console.log(reviews);
    const a = await AnkiInfo.findByIdAndUpdate(req.body.id, {
      $push: {
        revlog: { $each : reviews }
      },
      lastSynced: reviews[reviews.length-1].id,
    }, {upsert: true, useFindAndModify: false})
    a.

    res.status(200).send("Success");
  } catch (e) {
    console.log(e);
    res.status(500).send({error: e.toString()});
  }

})

router.get('/meta', async (req, res, done) => {
  try {
    if (!req.user.ankiInfo) {
      const anki = await AnkiInfo.create({userid: req.user._id});
      req.user.ankiInfo = anki._id;
      return await req.user.save();
    }
    else {
      await req.user.populate('ankiInfo').execPopulate();
      const body = {
        id: req.user.ankiInfo._id,
        lastSynced: req.user.ankiInfo.lastSynced,
      }
      await req.user.ankiInfo.save();
      res.send(body);
    }
  } catch(e) {
    console.log(e);
    res.status(500).send({message: e.toString()});
  }
})

module.exports = router;