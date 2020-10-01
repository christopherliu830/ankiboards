const OAuth2Server = require('express-oauth-server');
module.exports = new OAuth2Server({
  model: require('../model/authcode')
});