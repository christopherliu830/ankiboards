const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewEntrySchema = new Schema({
  id : {type: Number, index: true},
  cid : {type: Number},
  ease : {type: Number},
  ivl : {type: Number},
  lastlvl : {type: Number},
  factor : {type: Number},
  time : {type: Number},
  type : {type: Number},
  userid : {type: Schema.Types.ObjectId, ref: 'UserModel', required: true}
})
module.exports.ReviewEntry = mongoose.model('ReviewEntry', ReviewEntrySchema);

const AnkiInfoSchema = new Schema({
  reviews: { type: Object },
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
  ankiInfo: { type: AnkiInfoSchema },
});

module.exports.UserModel = mongoose.model('UserModel', UserSchema);