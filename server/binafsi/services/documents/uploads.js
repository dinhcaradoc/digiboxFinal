// This code is part of a document upload service that handles anonymous uploads
'use strict';

const Document = require('../../models/document');
const User = require('../../models/user');
const path = require('path');
const fs = require('fs').promises;
const googleDriveService = require('../storage/google-drive-service');

// Helper to normalize phone numbers to international format
const normalize = (phone) =>
  phone && phone.startsWith('+') ? phone : `+${phone.replace(/^0+/, '')}`;

// --- ANONYMOUS UPLOAD ---
exports.handleAnonymousUpload = async ({ senderPhone, recipientPhone, message, files }) => {
  const uploadedDocuments = [];
  let recipientStatus = 'unregistered';

  const sender = await User.findOne({ phone: normalize(senderPhone) });
  const recipient = recipientPhone
    ? await User.findOne({ phone: normalize(recipientPhone) })
    : null;

  if (recipient) recipientStatus = 'registered';

  for (const file of files) {
    const isSelfUpload = !recipientPhone;
    const targetUser = recipient || (isSelfUpload && sender ? sender : null);
    let newFileMeta = null;
    let storageType = 'local';

    // Upload to Google Drive if user has valid credentials
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

        await fs.unlink(file.path); // Clean up temp file
        storageType = 'google_drive';
      } catch (err) {
        console.error('Google Drive upload failed:', err.message);
      }
    }

    const docData = {
      name: file.originalname,
      filename: newFileMeta?.name || file.filename,
      driveFileId: newFileMeta?.fileId || undefined, // Store Drive file ID if present
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
      isTemporary: !targetUser,
      storageType,
      expiresAt: !targetUser ? new Date(Date.now() + 72 * 60 * 60 * 1000) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (targetUser) {
      docData.ownerId = targetUser._id;
      docData.uploadedBy = isSelfUpload && sender ? sender._id : undefined;
    }

    const document = new Document(docData);
    await document.save();
    uploadedDocuments.push(document);
  }

  return { uploadedDocuments, recipientStatus };
};

// --- AUTHENTICATED UPLOAD ---
exports.handleAuthenticatedUpload = async ({ user, files }) => {
  const uploadedDocuments = [];
  let storageType = 'local';

  for (const file of files) {
    let newFileMeta = null;

    if (
      user.googleTokens?.accessToken &&
      user.googleTokens?.refreshToken &&
      user.email
    ) {
      try {
        googleDriveService.setUserCredentials(
          user.googleTokens.accessToken,
          user.googleTokens.refreshToken
        );

        newFileMeta = await googleDriveService.uploadFile(
          file.path,
          file.originalname,
          user.email
        );

        await fs.unlink(file.path);
        storageType = 'google_drive';
      } catch (err) {
        console.error('Google Drive upload failed:', err.message);
      }
    }

    const docData = {
      name: file.originalname,
      filename: newFileMeta?.name || file.filename,
      driveFileId: newFileMeta?.fileId || undefined,
      attributes: {
        size: newFileMeta?.size || file.size.toString(),
        location: newFileMeta?.downloadLink || file.path,
        mimetype: file.mimetype,
        owner: user.phone
      },
      uploadInfo: {
        uploaderNumber: user.phone,
        isAnonymous: false
      },
      source: 'web_upload',
      isTemporary: false,
      storageType,
      ownerId: user._id,
      uploadedBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const document = new Document(docData);
    await document.save();
    uploadedDocuments.push(document);
  }

  return uploadedDocuments;
};
