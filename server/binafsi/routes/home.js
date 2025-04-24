//Redirects home routing requests to the apps home page via the home controller
"use strict"

const
    express = require('express'),
    multer = require('multer'),
    landingController = require('../controllers/index');

let router = express.Router();

router.get('/', landingController.landing)

module.exports = router;