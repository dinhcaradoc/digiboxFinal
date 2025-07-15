// This code is part of a document upload service that handles anonymous uploads
'use strict';

const Document = require('../../models/document');
const User = require('../../models/user');
const path = require('path');
const fs = require('fs').promises;
const googleDriveService = require('../storage/google-drive-service');

exports.handleAnonymousUpload = async ({ senderPhone, recipientPhone, message, files }) => {
  const uploadedDocuments = [];
  let recipientStatus = 'unregistered';

  // Normalize phone numbers
  const normalize = (phone) =>
    phone && phone.startsWith('+') ? phone : `+${phone.replace(/^0+/, '')}`;

  const sender = await User.findOne({ phone: normalize(senderPhone) });
  let recipient = null;
  if (recipientPhone) {
    recipient = await User.findOne({ phone: normalize(recipientPhone) });
    recipientStatus = recipient ? 'registered' : 'unregistered';
  }

  for (const file of files) {
    const isSelfUpload = !recipientPhone;
    let fileOwnerUser = null;
    let newFileMeta = null;
    let targetUser = null;
    let storageType = 'local';

    // Determine target (who "owns" the file permanently)
    if (recipient) {
      targetUser = recipient;
    } else if (sender && isSelfUpload) {
      targetUser = sender;
    }

    // Upload to Google Drive if the target user is registered and has Drive tokens
    if (
      targetUser &&
      targetUser.googleTokens?.accessToken &&
      targetUser.googleTokens?.refreshToken &&
      targetUser.email
    ) {
      try {
        googleDriveService.setUserCredentials(
          targetUser.googleTokens.accessToken,
          targetUser.googleTokens.refreshToken
        );

        newFileMeta = await googleDriveService.uploadFile(
          file.path,
          file.originalname,
          targetUser.email
        );

        // Cleanup: Remove original file from local temp storage
        await fs.unlink(file.path);
        storageType = 'google_drive';
      } catch (err) {
        console.error('Google Drive upload failed:', err.message);
      }
    }

    let docData = {
      name: file.originalname,
      filename: newFileMeta?.name || file.filename,
      attributes: {
        size: newFileMeta?.size || file.size.toString(),
        location: newFileMeta?.downloadLink || file.path,
        mimetype: file.mimetype,
        owner: recipientPhone ? normalize(recipientPhone) : normalize(senderPhone)
      },
      uploadInfo: {
        uploaderNumber: normalize(senderPhone),
        recipientPhone: recipientPhone ? normalize(recipientPhone) : undefined,
        message: message || '',
        isAnonymous: !sender
      },
      source: 'anonymous_upload',
      isTemporary: !targetUser, // If we lack a registered user, stay temporary
      storageType, // either 'google_drive' or 'local'
      expiresAt: !targetUser ? new Date(Date.now() + 72 * 60 * 60 * 1000) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Set DB foreign keys only if target user is registered
    if (targetUser) {
      docData.ownerId = targetUser._id;
      docData.uploadedBy = (isSelfUpload && sender) ? sender._id : undefined;
    }

    const document = new Document(docData);
    await document.save();
    uploadedDocuments.push(document);
  }

  return { uploadedDocuments, recipientStatus };
};
