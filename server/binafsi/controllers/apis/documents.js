// server/binafsi/controllers/apis/documents.js
// This controller handles routing requests related to document management

const express = require('express');
const checkAuthenticatedAPI = require('../../middleware/checkAuthenticatedAPI');
const documentsService = require('../../services/documents/documents');
const shareService = require('../../services/documents/share'); // Separate service for sharing logic

const router = express.Router();

// GET /api/documents - List uploads (docs owned by user)
router.get('/', checkAuthenticatedAPI, documentsService.listUploads);

// GET /api/documents/inbox - Docs shared to user (Inbox)
router.get('/inbox', checkAuthenticatedAPI, documentsService.listInbox);

// GET /api/documents/quickbox - Docs marked as priority (QuickBox)
router.get('/quickbox', checkAuthenticatedAPI, documentsService.listPriority);

// GET /api/documents/sent - List docs this user has shared (as sender)
router.get('/sent', checkAuthenticatedAPI, documentsService.listSent);

// GET /api/documents/:id/download - Download a document
router.get('/:id/download', checkAuthenticatedAPI, documentsService.downloadDocument);

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', checkAuthenticatedAPI, documentsService.deleteDocument);

// POST /api/documents/:id/share - Share a document
router.post('/:id/share', checkAuthenticatedAPI, shareService.shareDocument);

// PATCH /api/documents/:id/priority - Set/unset priority for a document
router.patch('/:id/priority', checkAuthenticatedAPI, documentsService.togglePriority);

module.exports = router;
