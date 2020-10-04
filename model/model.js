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
})
module.exports.ReviewEntry = mongoose.model('ReviewEntry', ReviewEntrySchema);

const AnkiInfoSchema = new Schema({
  revlog: {type: Object, default: []},
  heatmap: { type: Object, default: {}},
  lastSynced: {type: Number, default: 0},
  userid : {type: Schema.Types.ObjectId, ref: 'UserModel'},
})
module.exports.AnkiInfo = mongoose.model('AnkiInfo', AnkiInfoSchema);

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
  lastSynced: {type: Number},
  ankiInfo: { type: Schema.Types.ObjectId, ref: 'AnkiInfo'}, 
  client: { type: Schema.Types.ObjectId, ref: 'ClientModel'},
});

module.exports.UserModel = mongoose.model('UserModel', UserSchema);