var express = require('express');
var router = express.Router();
const UserModel = require('../model/model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({message: 'respond with a resource'});
});

router.get('/profile', async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).lean().exec();
  res.json({...user});
});

module.exports = router;
