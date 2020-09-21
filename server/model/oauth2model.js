const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OAuthClientModel = require('./model').OAuthClientModel;
const OAuthTokenModel = require('./model').OAuthTokenModel;
const UserModel = require('./model').UserModel;
const bcrypt = require('bcrypt');


const OAuthAuthorizationCodes = mongoose.model('OAuthAuthorizationCodes', new Schema({
  code: {type: Object},
  client: {type: Object},
  user: {type: Object},
}))

module.exports.getAccessToken = function(bearerToken) {
  return OAuthTokenModel.findOne({ accessToken: bearerToken }).lean();
}
module.exports.getClient = async function(clientId, clientSecret) {
  if (!clientSecret) {
    const client = await OAuthClientModel.findOne({clientId: clientId});
    return client;
  }
  else {
    const client = OAuthClientModel.findOne({clientId: clientId, clientSecret: clientSecret});
    return client;
  }
}
module.exports.getUser = async function(username, password) {
  const user = await UserModel.findOne({username});
  console.log(user);
  if (!user) return false;
  return await user.isValidPassword(password);
};
module.exports.getUserFromClient = async function(client) {
  console.log('id', client._id);
  const user = await UserModel.findOne({
    oauth2clients: {
      $elemMatch: {
        _id: client._id,
      }
    }
  });
  console.log('user', user);
  return user;
}
module.exports.saveToken = async function(token, client, user) {
  const doc = await OAuthTokenModel.create({
    ...token,
    client,
    user
  });
  return doc;
}
module.exports.saveAuthorizationCode = function(code, client, user) {
  console.log('saving auth code');
  return OAuthAuthorizationCodes.create({ 
    code: code,
    client: client,
    user: user,
  }) 
};
