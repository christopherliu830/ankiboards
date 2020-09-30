const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnkiInfoSchema = new Schema({
  reviews: { 
    type: Object 
  },
  revlog: {type: Array, default: []},
  lastSynced: {type: Number, default: 0},
})

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  }, 
  username_lower: {
    type: String,
  },
  firebaseUid : {
    type: String,
    required: true,
    unique: true,
  },
  client : {
    type: Object,
  },
  ankiInfo: {
    type: AnkiInfoSchema,
  },
});

module.exports.UserModel = mongoose.model('UserModel', UserSchema);