const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: Date,
  phone: String,
  username: String,
  email: { type: String, required: true, unique: true, lowercase: true, },
  password: {
    type: String,
    required: function () {
      return this.provider === 'local'; //  Only required for email/password users
    }
  },
  provider: {
    type: String,
    default: 'local' // 'google' or 'local'
  },
  resetToken: String,
  tokenExpiry: Date,
  profileImage: String,
});

module.exports = mongoose.model('User', userSchema);
