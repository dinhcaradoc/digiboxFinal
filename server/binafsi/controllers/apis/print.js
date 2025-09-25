//This controller handles requests related to printing('/print' route)
'use strict'

const express = require('express');
const printingService = require('../../services/authentication/printerAuth');
const router = express.Router();

router.get('/download/:otp', printingService.printDoc);

module.exports = router;