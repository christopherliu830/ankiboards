const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const AnkiInfoSchema = new Schema({
  cardsStudied : {
    type : Number,
    default: 0,
  },
});

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
    type : AnkiInfoSchema,
    default: {}
  }
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

module.exports = mongoose.model('ankiInfo', AnkiInfoSchema);
module.exports = mongoose.model('user', UserSchema);