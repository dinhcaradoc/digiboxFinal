//This controller provides methods for handling requests to the '/api/register' route
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const registerService = require('../../services/authentication/register');

let router = express.Router();

// Single registration endpoint that handles the complete registration process
router.post('/', registerService.registerUser);

module.exports = router;