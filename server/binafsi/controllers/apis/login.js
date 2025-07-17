// server/binafsi/controllers/login.js
'use strict';
const express = require('express');
const loginService = require('../../services/authentication/login');
const router = express.Router();

/**
 * POST /api/login
 * Body: { phone, password, provider, googleToken }
 * Returns: { token, user }
 */
router.post('/', loginService.loginUser);

module.exports = router;