//This controller handles requests to the '/login' route
'use strict';
const express = require('express');
const passport = require('passport');
const loginService = require('../../services/authentication/login');

let router = express.Router();

router.get('/', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs', { title: 'Login Page' });
});

router.post('/', loginService.loginUser);

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home');
  }
  next();
}

/*
router.post('/', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));
*/

module.exports = router;