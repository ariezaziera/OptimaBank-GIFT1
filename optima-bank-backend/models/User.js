// models/User.js
const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  voucherId: String,
  name: String,
  image: String,
  price: Number,
  serials: [{
    code: String,
    redeemedAt: Date
  }]
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: Date,
  phone: String,
  username: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: function () {
      return this.provider === 'local';
    }
  },
  provider: { type: String, default: 'local' },
  resetToken: String,
  tokenExpiry: Date,
  profileImage: String,
  points: { type: Number, default: 500 },
  rewards: [rewardSchema]
});

module.exports = mongoose.model('User', userSchema);
