const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  token: {
    type: Number, required: true
  },
  documentId: {
    type: String, required: true
  },
  timeStamp: { type: Date, default: Date.now, expires: '30m' }
})

module.exports = mongoose.model('otp', otpSchema)