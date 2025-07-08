// server/binafsi/controllers/login.js
'use strict';
const express = require('express');
const loginService = require('../../services/authentication/login');

let router = express.Router();

// API-only login endpoint
router.post('/', loginService.loginUser);

module.exports = router;