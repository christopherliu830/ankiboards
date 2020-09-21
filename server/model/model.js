const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const OAuthClient = new Schema({
  clientId: {type: String, required: true},
  clientSecret: {type: String, required: true},
  redirectUris: {type: Array},
  grants: {type: Array, default: ['client_credentials']},
}, {_id: true});

const UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  username : {
    type : String,
    required: true,
    unique: true,
  },
  ankiInfo: {
    cardsStudied: {
      type: Number,
      default: 0,
    }
  },
  oauth2clients: {
    type: [OAuthClient],
  },
});

UserSchema.pre('save', async function(next) {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  this.password = hash;
  next();
})
UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

const OAuthToken = new Schema({
  accessToken: {type: String},
  accessTokenExpiresAt: {type: Date},
  refreshToken: {type: String},
  refreshTokenExpresAt: {type: Date},
  scope: {type: String},
  client: {type: Object},
  user: {type: Object},
});



module.exports.OAuthTokenModel = mongoose.model('OAuthTokenModel', OAuthToken);
module.exports.OAuthClientModel = mongoose.model('OAuthClientModel', OAuthClient);
module.exports.UserModel = mongoose.model('UserModel', UserSchema);