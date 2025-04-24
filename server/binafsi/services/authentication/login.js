//Authentication middleware for log in requests
'use strict';
const express = require('express');
const apiRoutes = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../../../configs/db');
const User = require('../../models/user');

const loginUser = passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
});

module.exports = {
  loginUser: loginUser
};