'use strict';

const Document = require('../../models/document');
const User = require('../../models/user');
const path = require('path');
const fs = require('fs').promises;
const googleDriveService = require('../storage/google-drive-service');

/**
 * Migrates all temporary documents associated with a phone number to permanent storage.
 * If user has Google Drive tokens, documents are moved there. Otherwise, to local storage.
 *
 * @param {string} userPhone - The phone number associated with temporary documents
 * @param {string} userId - The authenticated user's MongoDB ObjectId
 * @returns {Promise<object>} - Result summary
 */
async function migrateTemporaryDocuments(userPhone, userId) {
  try {
    // 1. Fetch temporary docs tied to user's phone (either owner or recipient)
    const temporaryDocs = await Document.find({
      $or: [
        { 'attributes.owner': userPhone },
        { 'uploadInfo.recipientPhone': userPhone }
      ],
      isTemporary: true
    });

    const user = await User.findById(userId);
    const hasDrive =
      user &&
      user.googleTokens?.accessToken &&
      user.googleTokens?.refreshToken &&
      user.email;

    const migratedDocs = [];

    for (const doc of temporaryDocs) {
      const oldPath = doc.attributes.location;
      let driveMeta = null;

      if (hasDrive) {
        // -- Google Drive: Upload to user's Drive --
        googleDriveService.setUserCredentials(
          user.googleTokens.accessToken,
          user.googleTokens.refreshToken
        );

        driveMeta = await googleDriveService.uploadFile(
          oldPath,
          doc.name,
          user.email
        );

        // Update metadata to point to Drive
        doc.attributes.location = driveMeta.webViewLink; // <- Browser-friendly view
        doc.filename = driveMeta.name;
        doc.attributes.mimetype = driveMeta.mimetype || doc.attributes.mimetype;
        doc.attributes.size = driveMeta.size || doc.attributes.size;
        doc.storageType = 'google_drive';
        doc.driveFileId = driveMeta.fileId;

        // Remove the local file
        await fs.unlink(oldPath);
      } else {
        // -- Local fallback: Move file to permanent directory --
        const newFilename = `migrated-${Date.now()}-${path.basename(oldPath)}`;
        const newLocation = path.join('uploads', newFilename);
        await fs.rename(oldPath, newLocation);

        doc.attributes.location = newLocation;
        doc.filename = newFilename;
        doc.storageType = 'local';
        doc.driveFileId = undefined; // Clear Drive ID since it's not on Drive
      }

      // Final metadata updates
      doc.ownerId = userId;
      doc.uploadedBy = doc.uploadInfo?.uploaderNumber === userPhone ? userId : null;
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