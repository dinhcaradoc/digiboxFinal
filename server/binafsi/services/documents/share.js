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

    const { recipients, message } = req.body;
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0)
      return res.status(400).json({ error: 'Recipients array required.' });

    const results = [];
    for (const recipientRaw of recipients) {
      const recipient = recipientRaw.startsWith("+") ? recipientRaw : `+${recipientRaw.replace(/^0+/, "")}`;
      // Duplicate prevention
      const existing = await Document.findOne({
        'uploadInfo.uploaderNumber': req.user.phone,
        'uploadInfo.recipientPhone': recipient,
        'attributes.owner': recipient,
        name: doc.name,
      });
      if (existing) {
        results.push({ recipient, status: "duplicate" });
        continue;
      }
      // Registered recipient?
      const recipientUser = await User.findOne({ phone: recipient });
      if (recipientUser) {
        const sharedDoc = new Document({
          ...doc.toObject(),
          _id: undefined,
          driveFileId: doc.driveFileId,
          filename: doc.filename,
          attributes: { ...doc.attributes, owner: recipient },
          uploadInfo: {
            uploaderNumber: req.user.phone,
            recipientPhone: recipient,
            message: message || "",
            isAnonymous: false,
          },
          isTemporary: false,
          priority: false,
          ownerId: recipientUser._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await sharedDoc.save();
        await sendSMS({ to: recipient, message: `A document was shared with you. Log in to DigiBox Chapisha to view.` });
        results.push({ recipient, status: "shared" });
      } else {
        // Not registered
        const tempDoc = new Document({
          ...doc.toObject(),
          _id: undefined,
          driveFileId: doc.driveFileId,
          filename: doc.filename,
          attributes: { ...doc.attributes, owner: recipient },
          uploadInfo: {
            uploaderNumber: req.user.phone,
            recipientPhone: recipient,
            message: message || "",
            isAnonymous: true,
          },
          isTemporary: true,
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
          priority: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await tempDoc.save();
        await sendSMS({ to: recipient, message: `A document was shared with you on DigiBox Chapisha. Register to access!` });
        results.push({ recipient, status: "invited" });
      }
    }
    return res.status(200).json({
      success: true,
      message: `Document shared with ${results.length} recipient(s)`,
      results,
    });
  } catch (e) {
    res.status(500).json({ error: 'Error sharing document.' });
  }
};