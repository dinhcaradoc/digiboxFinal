//Authentication middleware for handling registration requests
'use strict';
const express = require('express');
const User = require('../../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//const User = mongoose.model('User');

const httpMessages = {

  onValidationError: {
    success: false,
    message: 'Please enter a phone number and a password.'
  },

  onUserSaveError: {
    success: false,
    message: 'That phone number is already in use'
  },

  onUserSaveSuccess: {
    success: true,
    message: 'Successfully created new user.'
  }
}
// Register new users
async function registerUser(req, res) {
  let { firstName, lastName, phone } = req.body;
  let hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    firstname: firstName,
    lastname: lastName,
    phone: phone,
    password: hashedPassword
  });
  user.save(error => {
    if (error) {
      req.flash('saveErr', httpMessages.onUserSaveError.message)
      console.log(error)
      return res.redirect('/register')
    }
    req.session.userId = user._id;
    res.redirect('./login');
    console.log(user._id)
  });
}

module.exports = {
  registerUser: registerUser
};