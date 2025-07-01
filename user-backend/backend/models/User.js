const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
  phone: String,
  dob: Date,
  language: String,
  mentalHealthStatus: String,
  isProfileComplete: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
