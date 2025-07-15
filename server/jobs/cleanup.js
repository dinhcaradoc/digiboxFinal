// server/jobs/cleanup.js
// This module handles the cleanup of expired temporary documents in the system.
'use strict'; 

const cron = require('node-cron');
const Document = require('../models/document');
const fs = require('fs').promises;

// Function to clean up expired temporary documents
async function cleanupExpiredDocuments() {
  try {
    const expiredDocs = await Document.find({
      isTemporary: true,
      expiresAt: { $lt: new Date() }
    });

    let deletedCount = 0;
    let fileDeleteErrors = [];

    for (const doc of expiredDocs) {
      try {
        await fs.unlink(doc.attributes.location);
      } catch (fileError) {
        fileDeleteErrors.push({
          documentId: doc._id,
          filePath: doc.attributes.location,
          error: fileError.message
        });
      }

      await Document.findByIdAndDelete(doc._id);
      deletedCount++;
    }

    return {
      success: true,
      deletedCount,
      fileDeleteErrors: fileDeleteErrors.length > 0 ? fileDeleteErrors : null
    };
  } catch (error) {
    console.error('Cleanup error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Schedule the cleanup job to run every hour
const cleanupJob = cron.schedule('0 * * * *', async () => {
  console.log('Starting expired document cleanup...');
  const result = await cleanupExpiredDocuments();
  if (result.success) {
    console.log(`Cleanup completed. Deleted ${result.deletedCount} expired documents.`);
    if (result.fileDeleteErrors) {
      console.warn('Some files could not be deleted:', result.fileDeleteErrors);
    }
  } else {
    console.error('Cleanup failed:', result.error);
  }
}, {
  scheduled: false
});

// Function to start the cleanup job
function startCleanupJob() {
  cleanupJob.start();
  console.log('Document cleanup job started');
}

module.exports = {
  startCleanupJob,
  cleanupJob,
  cleanupExpiredDocuments
};