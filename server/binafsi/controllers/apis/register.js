//This controller provides methods for handling requests to the '/register' route
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const registerService = require('../../services/authentication/register');

let router = express.Router();
const User = mongoose.model('User');
const users = [];

router.get('/', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs', {
    title: 'Registration Page',
    message: req.flash('saveErr')
  });
});

router.post('/', registerService.registerUser);

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}
//router.post('/', registerService.registerUser);

module.exports = router;