//This controller provides methods for handling requests to the '/api/register' route
'use strict';
const express = require('express');
const registerService = require('../../services/authentication/register');
const router = express.Router();

/**
 * POST /api/register
 * Body: { name, phone, email, password, provider, googleToken }
 */
router.post('/', registerService.registerUser);

module.exports = router;
