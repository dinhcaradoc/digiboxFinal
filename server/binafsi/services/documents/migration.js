// This module handles the migration of temporary documents to permanent storage,

'use strict';

const Document = require('../../models/document');
const User = require('../../models/user');
const path = require('path');
const fs = require('fs').promises;
const googleDriveService = require('../storage/google-drive-service');

async function migrateTemporaryDocuments(userPhone, userId) {
  try {
    // Find all temporary documents associated with this phone number
    const temporaryDocs = await Document.find({
      $or: [
        { 'attributes.owner': userPhone },
        { 'uploadInfo.recipientPhone': userPhone }
      ],
      isTemporary: true
    });

    // Fetch the user and check for Google Drive integration
    const user = await User.findById(userId);
    const hasDrive =
      user &&
      user.googleTokens &&
      user.googleTokens.accessToken &&
      user.googleTokens.refreshToken &&
      user.email;

    let migratedDocs = [];

    for (const doc of temporaryDocs) {
      const oldPath = doc.attributes.location;
      let newLocation, newFilename, driveMeta = null;

      if (hasDrive) {
        // Set Google Drive credentials for this user
        googleDriveService.setUserCredentials(
          user.googleTokens.accessToken,
          user.googleTokens.refreshToken
        );

        // Upload to user's DigiBox folder in Google Drive
        driveMeta = await googleDriveService.uploadFile(
          oldPath,
          doc.name,
          user.email
        );

        // Update document metadata for Google Drive
        doc.attributes.location = driveMeta.webViewLink;
        doc.filename = driveMeta.name;
        doc.attributes.mimetype = driveMeta.mimetype || doc.attributes.mimetype;
        doc.attributes.size = driveMeta.size || doc.attributes.size;
        doc.storageType = 'google_drive';
        doc.driveFileId = driveMeta.fileId;

        // Remove the local file after successful upload
        await fs.unlink(oldPath);
      } else {
        // Fallback: move to permanent local storage
        newFilename = `migrated-${Date.now()}-${path.basename(oldPath)}`;
        newLocation = path.join('uploads', newFilename);
        await fs.rename(oldPath, newLocation);

        doc.attributes.location = newLocation;
        doc.filename = newFilename;
        doc.storageType = 'local';
      }

      // Update document ownership and status
      doc.ownerId = userId;
      doc.uploadedBy = doc.uploadInfo.uploaderNumber === userPhone ? userId : null;
      doc.isTemporary = false;
      doc.expiresAt = null;
      doc.updatedAt = new Date();

      await doc.save();
      migratedDocs.push(doc);
    }

    return {
      success: true,
      migratedCount: migratedDocs.length,
      documents: migratedDocs
    };
  } catch (error) {
    console.error('Document migration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  migrateTemporaryDocuments
};