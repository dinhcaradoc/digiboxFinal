const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  token: {
    type: Number
  },
  documentId: {
    type: String
  },
  timeStamp: { type: Date, default: Date.now, expires: '30m' }
})

module.exports = mongoose.model('otp', otpSchema)