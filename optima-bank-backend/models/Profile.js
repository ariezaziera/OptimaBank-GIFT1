const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  phone: String,
  password: String,
  gender: String,
  language: String,
  address: String,
  postcode: String,
  country: String,
  payment: String,
  dob: Date,
  profileImage: String, // <-- URL gambar profil
  provider: String,
  resetToken: String,
  tokenExpiry: Date,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
