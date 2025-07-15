//Redirects user requests to the appropriate URL. I.e., it handles all routing requests to the server
'use strict';

const express = require('express');
const passport = require('passport');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ─── CONTROLLERS ─────────────────────────────────────────────── //
const registerController = require('../controllers/apis/register');
const loginController = require('../controllers/apis/login');
const dashboardController = require('../controllers/apis/dashboard');
const printingController = require('../controllers/apis/print');
const uploadController = require('../controllers/apis/doc-upload');             // ✅ Anonymous upload handler
const printingService = require('../services/authentication/printerAuth');
const ussdController = require('../controllers/apis/ussd');
const apiController = require('../controllers/documents');
const homeRoute = require('./home');

const User = require('../models/user');

// ─── MIDDLEWARE SETUP ─────────────────────────────────────────── //
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/home');
  next();
}

// ─── ROUTES ────────────────────────────────────────────────────── //

// Home page (landing)
router.get('/', checkNotAuthenticated, homeRoute);

// Authenticated dashboard
router.use('/home', checkAuthenticated, dashboardController);

// API: Auth
router.use('/api/login', loginController);
router.use('/api/register', registerController);

// API: Anonymous upload (landing page modal)
router.post('/api/upload', uploadController.handleAnonymousUpload); // ✅ Now handled entirely by the controller

// API: Authenticated document actions (inbox, uploads, etc.)
router.use('/api', apiController);

// USSD integration
router.use('/ussd', ussdController.initUssd);

// Print handling
router.use('/print', printingController);
router.post('/download', printingService.printDoc);

// Logout
router.delete('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Optional dev/test
router.use('/test', (_req, res) => {
  res.render('test.ejs', { title: 'Test Page' });
});

// Legacy redirects (optional)
router.get('/inbox', (_req, res) => res.redirect('/home/inbox'));
router.get('/priority', (_req, res) => res.redirect('/home/priority'));

// Optional: Browse filedrop contents (for dev/debug only)
router.get('/fileDrop/*splat', (req, res) => {
  const file = path.join(__dirname, '../../', decodeURIComponent(req.url));
  fs.readFile(file, (err, data) => {
    if (err) {
      console.log(err);
      // res.status(404).send('File not found');
      return res.status(404).send('File not found');
    }
    res.send(data);
  });
});

// ─── PASSPORT STRATEGY INIT ───────────────────────────────────── //
const initializePassport = require('../../passport-config');
initializePassport(
  passport,
  async (phone) => await User.findOne({ phone }),
  async (id) => await User.findById(id)
);

module.exports = router;