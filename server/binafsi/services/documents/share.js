// server/binafsi/services/documents/share.js
// This service handles document sharing operations
'use strict';

const Document = require('../../models/document');
const User = require('../../models/user');
const sendSMS = require('../../controllers/apis/sendSMS');

exports.shareDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found.' });
    if (doc.attributes.owner !== req.user.phone)
      return res.status(403).json({ error: 'You do not own this document.' });

    const { recipient, message } = req.body;
    if (!recipient) return res.status(400).json({ error: 'Recipient phone required.' });

    // Registered recipient?
    const recipientUser = await User.findOne({ phone: recipient });
    if (recipientUser) {
      // Copy doc as new for recipient's inbox
      const sharedDoc = new Document({
        ...doc.toObject(),
        _id: undefined,
        attributes: {
          ...doc.attributes,
          owner: recipient
        },
        uploadInfo: {
          uploaderNumber: req.user.phone,
          recipientPhone: recipient,
          message: message || '',
          isAnonymous: false
        },
        priority: false,
        isTemporary: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await sharedDoc.save();
      await sendSMS({ to: recipient, message: `A document was shared with you. Log in to DigiBox Chapisha to view.` });
    } else {
      // Not registered: create temp/anon doc for recipient, send SMS invite (no ownerId)
      const tempDoc = new Document({
        ...doc.toObject(),
        _id: undefined,
        attributes: {
          ...doc.attributes,
          owner: recipient
        },
        uploadInfo: {
          uploaderNumber: req.user.phone,
          recipientPhone: recipient,
          message: message || '',
          isAnonymous: true
        },
        isTemporary: true,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        priority: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await tempDoc.save();
      await sendSMS({ to: recipient, message: `A document was shared with you on DigiBox Chapisha. Register to access!` });
    }
    res.status(200).json({ success: true, message: 'Document shared.' });
  } catch (e) {
    res.status(500).json({ error: 'Error sharing the document.' });
  }
};