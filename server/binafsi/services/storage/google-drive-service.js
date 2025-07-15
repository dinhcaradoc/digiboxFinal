// server/services/storage/google-drive-service.js
// This service provides methods to interact with Google Drive, including uploading files, creating folders, and managing permissions.
'use strict';

const { google } = require('googleapis');
const fs = require('fs');

class GoogleDriveService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  setUserCredentials(accessToken, refreshToken) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }

  async createDigiBoxFolder(userEmail) {
    const existingFolders = await this.drive.files.list({
      q: "name='DigiBox Chapisha' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id, name)'
    });

    if (existingFolders.data.files.length > 0) {
      return existingFolders.data.files[0].id;
    }

    const folderMetadata = {
      name: 'DigiBox Chapisha',
      mimeType: 'application/vnd.google-apps.folder'
    };

    const folder = await this.drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });

    return folder.data.id;
  }

  async uploadFile(filePath, fileName, userEmail, folderId = null) {
    if (!folderId) {
      folderId = await this.createDigiBoxFolder(userEmail);
    }

    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath)
    };

    const file = await this.drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink, size'
    });

    // Make file accessible (optional: adjust permissions as needed)
    await this.drive.permissions.create({
      fileId: file.data.id,
      resource: {
        role: 'reader',
        type: 'anyone'
      }
    });

    return {
      fileId: file.data.id,
      name: file.data.name,
      webViewLink: file.data.webViewLink,
      downloadLink: file.data.webContentLink,
      size: file.data.size
    };
  }

  async downloadFile(fileId, destinationPath = null) {
    const response = await this.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });

    if (destinationPath) {
      const writer = fs.createWriteStream(destinationPath);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(destinationPath));
        writer.on('error', reject);
      });
    }

    return response.data;
  }

  async deleteFile(fileId) {
    await this.drive.files.delete({ fileId: fileId });
    return true;
  }

  async getFileMetadata(fileId) {
    const response = await this.drive.files.get({
      fileId: fileId,
      fields: 'id, name, size, mimeType, webViewLink, webContentLink, createdTime, modifiedTime'
    });
    return response.data;
  }

  async shareFileWithUser(fileId, userEmail, role = 'reader') {
    await this.drive.permissions.create({
      fileId: fileId,
      resource: {
        role: role,
        type: 'user',
        emailAddress: userEmail
      }
    });
    return true;
  }
}

module.exports = new GoogleDriveService();