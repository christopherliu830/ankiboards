const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthClientSchema = new Schema({
  id: {type: String, required: true },
  secret: {type: String},
  grants: {type: [String], default: ["authorization_code"]},
  redirectUris: { type: [String], default: ["http://localhost:9091"]},
  accessTokenLifetime: { type: Number, default: 315569520 } // 10 years
});

const OAuthTokenSchema = new Schema({
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  client: { type: Object },
  clientId: { type: String },
  refreshToken: { type: String },
  refreshTokenExpiresOn: { type: Date },
  user : { type: Object },
})

const OAuthAuthCodeSchema = new Schema({
  authorizationCode: { type: String },
  expiresAt: { type : Date },
  redirectUri: { type : String },
  scope : { type: String },
  client: { type: OAuthClientSchema },
  user : { type: Object },
})

const OAuthClientModel = mongoose.model('OAuthClient', OAuthClientSchema);
const OAuthTokenModel = mongoose.model('OAuthToken', OAuthTokenSchema);
const OAuthAuthCodeModel = mongoose.model('OAuthAuthCode', OAuthAuthCodeSchema);

module.exports.getAuthorizationCode = async function(code) {
  return await OAuthAuthCodeModel.findOne({authorizationCode: code});
}

module.exports.getClient = async function(clientId, clientSecret) {
  if (!clientSecret) {
    const client = await OAuthClientModel.findOne({id: clientId})
    return client;
  }
  else {
    const client = await OAuthClientModel.findOne({id: clientId, secret: clientSecret});
    return client;
  }
}

module.exports.saveToken = async function(token, client, user) {
  const doc = new OAuthTokenModel({
    ...token,
    client: client,
    user: user,
  })
  return await doc.save();
}

module.exports.getAccessToken = async function(accessToken) {
  return await OAuthTokenModel.findOne({accessToken: accessToken});
}

module.exports.saveAuthorizationCode = async function(code, client, user) {
  const doc = await OAuthAuthCodeModel.create({
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: client,
    user: user,
  })
  return doc.toObject();
}

module.exports.revokeAuthorizationCode = async function(code) {
  try {
    await OAuthAuthCodeModel.findOneAndDelete({authorizationCode: code.code});
    console.log('deleted code');
    return true;
  }
  catch (e) {
    console.log('Tried finding and deleting but got error', e);
    return false;
  }
}