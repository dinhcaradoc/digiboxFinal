// server/binafsi/services/documents/documents.js
// This service handles document management operations

'use strict';

const Document = require('../../models/document');
const User = require('../../models/user');
const path = require('path');
const fs = require('fs').promises;

// ========== 1. List Docs Uploaded By This User ==========
exports.listUploads = async (req, res) => {
  try {
    const phone = req.user.phone;
    const docs = await Document.find({ 'attributes.owner': phone });
    res.status(200).json(docs);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching uploaded documents.' });
  }
};

// ========== 2. List Inbox (Received/Shared To This User) ==========
exports.listInbox = async (req, res) => {
  try {
    const phone = req.user.phone;
    const docs = await Document.find({ 'uploadInfo.recipientPhone': phone });
    res.status(200).json(docs);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching inbox documents.' });
  }
};

// ========== 3. List Priority Docs (QuickBox) ==========
exports.listPriority = async (req, res) => {
  try {
    const phone = req.user.phone;
    const docs = await Document.find({ 'attributes.owner': phone, priority: true });
    res.status(200).json(docs);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching priority documents.' });
  }
};

// ========== 4. Download Document ==========
exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found.' });

    // Permission: Only owner or recipient can download
    const phone = req.user.phone;
    if (
      doc.attributes.owner !== phone &&
      doc.uploadInfo.recipientPhone !== phone
    ) {
      return res.status(403).json({ error: 'Not authorized for this document.' });
    }

    // Local file
    if (doc.storageType === 'local') {
      const absPath = path.resolve(doc.attributes.location);
      return res.download(absPath, doc.name);
    }
    // Google Drive
    if (doc.storageType === 'google_drive') {
      // Provide a redirect, a signed URL, or stream via Drive API (depends on your googleDriveService)
      // For now, safest fallback is to send the public/signed download link if stored
      if (doc.attributes.location) {
        return res.redirect(doc.attributes.location);
      }
      return res.status(500).json({ error: 'Could not download Google Drive file (no link available).' });
    }
    res.status(500).json({ error: 'Unknown storage type.' });
  } catch (e) {
    res.status(500).json({ error: 'Error downloading this document.' });
  }
};

// ========== 5. Delete Document (by owner only) ==========
exports.deleteDocument = async (req, res) => {
  try {
    const phone = req.user.phone;
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ error: 'Document not found.' });
    if (doc.attributes.owner !== phone)
      return res.status(403).json({ error: 'You do not own this document.' });

    // Try to delete file locally (skip Drive/Future: add Drive delete if needed)
    if (doc.storageType === 'local' && doc.attributes.location) {
      try { await fs.unlink(path.resolve(doc.attributes.location)); } catch (e) { /* ignore file not found */ }
    }

    await doc.remove();
    res.status(200).json({ success: true, message: 'Document deleted.' });
  } catch (e) {
    res.status(500).json({ error: 'Error deleting document.' });
  }
};

// ========== 6. Toggle Priority ==========
exports.togglePriority = async (req, res) => {
  try {
    const phone = req.user.phone;
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ error: 'Document not found.' });
    if (doc.attributes.owner !== phone)
      return res.status(403).json({ error: 'You do not own this document.' });

    doc.priority = !doc.priority;
    await doc.save();

    res.status(200).json({ success: true, priority: doc.priority });
  } catch (e) {
    res.status(500).json({ error: 'Error updating priority.' });
  }
};