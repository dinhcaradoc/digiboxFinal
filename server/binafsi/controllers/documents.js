//This controllers handles routing requests related to file methods
const getDoc = require('../services/dashboard/getDocs');
const printCode = require('../services/authentication/printerAuth');
const express = require('express');

let router = express.Router();

router.get('/getall', getDoc.getFiles); //The getFile function fetches all documents associated with a particular parameter. E.g. it currently fetches all documents associated with a particular phone number

router.post('/shortcode', getDoc.getServiceDoc); //Callback url for two-way sms

router.post('/serviceDoc', getDoc.shareServiceDocs); //Service line for document access provisioning

router.delete('/document/:documentId', getDoc.docDelete);

router.post('/sendletter', getDoc.massShareDocs)  //Mass document distribution for files from miscrosoft word

router.post('/sharefile', getDoc.share_file); //Allow user to share files

router.get('/printauth', printCode.getOTP); //File OTP generation

module.exports = router;