'use strict';

const multer = require('multer');
const uploadService = require('../../services/documents/upload');

// Multer configuration for authenticated uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
    cb(null, `user-${unique}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
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

// Controller: Handles authenticated uploads
exports.handleAuthenticatedUpload = (req, res) => {
  upload.array('userdoc', 10)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files received.' });
    }
    try {
      const result = await uploadService.handleAuthenticatedUpload({
        user: req.user,
        files: req.files
      });
      res.status(200).json({ success: true, documents: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'An error occurred during upload.' });
    }
  });
};
// This controller handles authenticated file uploads, ensuring that only logged-in users can upload documents.