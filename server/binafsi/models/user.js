// server/models/user.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\+\d{10,15}$/.test(v);
      },
      message: 'Phone number must be in international format'
    }
  },
  email: { type: String, required: false, unique: true, sparse: true },
  firstname: { type: String, required: false },
  lastname: { type: String, required: false },
  password: { type: String, required: false },
  googleId: { type: String, required: false },
  googleTokens: {
    accessToken: { type: String },
    refreshToken: { type: String }
  },
  driveFolderId: { type: String, required: false },
  accountType: { type: String, enum: ['basic', 'enterprise'], default: 'basic' },
  enterpriseFeatures: {
    serviceDocuments: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for fast phone lookups
UserSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
// This schema defines the structure for user accounts in the system.