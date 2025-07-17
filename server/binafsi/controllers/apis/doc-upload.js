'use strict';

const multer = require('multer');
const uploadService = require('../../services/documents/uploads');

// Multer configuration for anonymous uploads
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'filedrop/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `temp-${unique}-${safeName}`);
  },
});

const upload = multer({
  storage: tempStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];
    if (allowedMime.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file format.'));
  }
});

// Controller: Handles anonymous uploads
exports.handleAnonymousUpload = (req, res) => {
  upload.array('userdoc', 5)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }

    const { phoneNumber, recipientPhone, message } = req.body;

    if (!phoneNumber || !/^\+\d{10,15}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sender phone number. Use international format (+254...)'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files received.'
      });
    }

    try {
      const result = await uploadService.handleAnonymousUpload({
        senderPhone: phoneNumber,
        recipientPhone,
        message,
        files: req.files
      });

      return res.status(200).json({
        success: true,
        message: 'File(s) uploaded successfully',
        documents: result.uploadedDocuments,
        recipientStatus: result.recipientStatus
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing your upload. Please try again later.'
      });
    }
  });
};