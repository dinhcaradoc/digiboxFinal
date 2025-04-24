//This controller handles requests related to printing('/print' route)
'use strict'

const express = require('express');
const printingService = require('../../services/authentication/printerAuth');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('print.ejs', { title: 'DigiBox Print' });
});

router.post('/download', printingService.printDoc);

module.exports = router;