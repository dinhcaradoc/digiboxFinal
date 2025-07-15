// server/models/document.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filename: { type: String, required: false },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  attributes: {
    size: { type: String, required: true },
    location: { type: String, required: true },
    owner: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^\+\d{10,15}$/.test(v);
        },
        message: 'Owner phone must be in international format'
      }
    },
    mimetype: { type: String, required: false }
  },
  uploadInfo: {
    uploaderNumber: { 
      type: String, 
      required: false,
      validate: {
        validator: function(v) {
          return !v || /^\+\d{10,15}$/.test(v);
        },
        message: 'Uploader phone must be in international format'
      }
    },
    recipientPhone: { 
      type: String, 
      required: false,
      validate: {
        validator: function(v) {
          return !v || /^\+\d{10,15}$/.test(v);
        },
        message: 'Recipient phone must be in international format'
      }
    },
    message: { type: String, required: false },
    isAnonymous: { type: Boolean, default: false }
  },
  priority: { type: Boolean, default: false },
  isTemporary: { type: Boolean, default: false },
  source: { 
    type: String, 
    enum: ['web_upload', 'anonymous_upload', 'sms_share', 'word_letter', 'ussd_upload'],
    default: 'web_upload'
  },
  expiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries and cleanup
DocumentSchema.index({ ownerId: 1, createdAt: -1 });
DocumentSchema.index({ 'attributes.owner': 1, createdAt: -1 });
DocumentSchema.index({ 'uploadInfo.uploaderNumber': 1 });
DocumentSchema.index({ 'uploadInfo.recipientPhone': 1 });
DocumentSchema.index({ isTemporary: 1, expiresAt: 1 });
DocumentSchema.index({ source: 1 });
DocumentSchema.index({ priority: 1 });
DocumentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Document', DocumentSchema);
// This schema defines the structure for documents uploaded to the system.