// server/binafsi/routes/app.js
//This module defines the main application routes for the Binafsi server.

'use strict';

const express = require('express');
const passport = require('passport');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ─── CONTROLLERS & ROUTERS ──────────────────────────────── //
const registerController = require('../controllers/apis/register');
const loginController = require('../controllers/apis/login');
const dashboardController = require('../controllers/apis/dashboard');
const printingController = require('../controllers/apis/print');
const uploadController = require('../controllers/apis/doc-upload'); // Anonymous uploads (landing)
const docApiRoutes = require('../controllers/apis/documents');      // ALL /api/documents/...
const checkAuthenticatedAPI = require('../middleware/checkAuthenticatedAPI');
const homeRoute = require('./home');
const printingService = require('../services/authentication/printerAuth');
const ussdController = require('../controllers/apis/ussd');
const User = require('../models/user');

// ─── MIDDLEWARE SETUP ───────────────────────────────────── //
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/home');
  next();
}

// ─── ROUTES ─────────────────────────────────────────────── //

/* HOMEPAGE (public, landing) */
router.get('/', checkNotAuthenticated, homeRoute);

/* DASHBOARD (authenticated) */
router.use('/home', checkAuthenticated, dashboardController);

/* AUTHENTICATION ENDPOINTS */
router.use('/api/login', loginController);
router.use('/api/register', registerController);

/* ANONYMOUS FILE UPLOAD (landing page/modal) */
router.post('/api/upload', uploadController.handleAnonymousUpload);

/* ALL DOCUMENT API ENDPOINTS (RESTful, modularized) */
router.use('/api/documents', docApiRoutes);
// Handles:
//   - GET      /api/documents             (uploads)
//   - POST     /api/documents/upload      (authenticated upload)
//   - DELETE   /api/documents/:id         (delete)
//   - GET      /api/documents/:id/download
//   - POST     /api/documents/:id/share
//   - PATCH    /api/documents/:id/priority (toggle quickbox)
//   - GET      /api/documents/inbox       (received docs)
//   - GET      /api/documents/quickbox    (priority docs)

/* USSD AND PRINTING */
router.use('/ussd', ussdController.initUssd);
router.use('/print', printingController);
router.post('/download', printingService.printDoc);

/* LOGOUT */
router.delete('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

/* DEV/TEST ROUTES (only for development) */
router.use('/test', (_req, res) => {
  res.render('test.ejs', { title: 'Test Page' });
});

/* LEGACY REDIRECTS (optional) */
router.get('/inbox', (_req, res) => res.redirect('/home/inbox'));
router.get('/priority', (_req, res) => res.redirect('/home/priority'));

/* FILE DROP DEBUG/DEV ONLY */
router.get('/fileDrop/*splat', (req, res) => {
  const file = path.join(__dirname, '../../', decodeURIComponent(req.url));
  fs.readFile(file, (err, data) => {
    if (err) return res.status(404).send('File not found');
    res.send(data);
  });
});

/* PASSPORT INIT (if using local strategy) */
const initializePassport = require('../../passport-config');
initializePassport(
  passport,
  async (phone) => await User.findOne({ phone }),
  async (id) => await User.findById(id)
);

module.exports = router;