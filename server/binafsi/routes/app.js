//Redirects user requests to the appropriate URL. I.e., it handles all routing requests to the server
'use strict'

//calling dependencies
const
  express = require('express'),
  bcrypt = require('bcrypt'),
  passport = require('passport'),
  multer = require('multer'),
  fs = require('fs');

//specifying controllers for various functions
const
  registerController = require('./../controllers/apis/register'),
  loginController = require('./../controllers/apis/login'),
  dashboardController = require('./../controllers/apis/dashboard'),
  printingController = require('./../controllers/apis/print'),
  ussdController = require('./../controllers/apis/ussd'),
  printingService = require('./../services/authentication/printerAuth'),
  uploadController = require('./../controllers/apis/doc-upload'),
  apiController = require('../controllers/documents'),
  homeRoute = require('./home');

const User = require('../models/user');
const Document = require('../models/document')

let router = express.Router();

router.get('/', checkNotAuthenticated, homeRoute);
router.use('/home', checkAuthenticated, dashboardController);
router.use('/login', loginController);
router.use('/register', registerController);
router.use('/ussd', ussdController.initUssd);
router.use('/print', printingController);
router.post('/download', printingService.printDoc);
router.use('/test', (req, res) => {
  res.render('test.ejs', { title: 'Test Page' })
});

router.get('/inbox', (req, res) => {
  res.redirect('/home/inbox');
});

router.get('/priority', (req, res) => {
  res.redirect('/home/priority');
});

//Method for viewing contents stored in the filedrop folder
router.get('/fileDrop/*splat', (req, res) => {
  const file = path.join(__dirname, '../../', decodeURIComponent(req.url));
  console.log(file)
  
  fs.readFile(file, (err, data) => {
    if (err) {
      console.log(err);
      // res.status(404).send('File not found');
    } else {
      res.send(data);
    }
  });
})

router.use('/api', apiController);

/* //methods for document upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  }
})*/

//const upload = multer({ storage: storage });

/*router.post('/upload', upload.single('userdoc'), (req, res) => {
  if (req.files) {
    console.log(req.files);
  }
});*/

router.post('/upload-document', uploadController.upload);

/*router.post('/submitDoc', (req, res) => {
  let { uploadNumber, uploadMessage } = req.body;
  const docSendDetails = [ uploadNumber, uploadMessage ];
  console.log(docSendDetails);
})*/

router.post('/submitDoc', uploadController.add);

//methods for registering and logging in a user
const initializePassport = require('../../passport-config');

initializePassport(
  passport,
  phone => User.findOne(user => User.phone === phone),
  id => User.findOne(user => User.id === id)
);

//logout a user
router.delete('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home');
  }
  next();
}

module.exports = router;