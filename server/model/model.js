const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  }, 
  firebaseUid : {
    type: String,
    required: true,
    unique: true,
  },
  ankiInfo: {
    cardsStudied: {
      type: Number,
      default: 0,
    }
  },
});

module.exports.UserModel = mongoose.model('UserModel', UserSchema);