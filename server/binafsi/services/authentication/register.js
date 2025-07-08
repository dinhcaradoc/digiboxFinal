// Authentication middleware for handling registration requests
'use strict';

const express = require('express');
const User = require('../../models/user');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Ensure this is set in your environment variables

const httpMessages = {
  onValidationError: {
    success: false,
    message: 'Please enter all required fields.'
  },
  onEmailExistsError: {
    success: false,
    message: 'That email is already in use'
  },
  onPhoneExistsError: {
    success: false,
    message: 'That phone number is already in use'
  },
  onUserSaveSuccess: {
    success: true,
    message: 'Successfully created new user.'
  }
};

// Helper function to verify Google token
async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
      googleId: payload['sub'],
      email: payload['email'],
      firstname: payload['given_name'],
      lastname: payload['family_name'],
      picture: payload['picture']
    };
  } catch (err) {
    console.error('Failed to verify Google token:', err);
    return null;
  }
}

// Single registration endpoint that handles both email/password and Google registrations
async function registerUser(req, res) {
  try {
    console.log('Registration request:', req.body);

    const { name, email, password, phone, provider, googleToken } = req.body;

    // Validate phone number (required for all registrations)
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required.'
      });
    }

    if (!/^\+?\d{10,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number.'
      });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json(httpMessages.onPhoneExistsError);
    }

    let userData;

    // Google Registration Flow
    if (provider === 'google' && googleToken) {
      const googleUser = await verifyGoogleToken(googleToken);

      if (!googleUser) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Google token.'
        });
      }

      const { email: googleEmail, firstname, lastname, googleId } = googleUser;

      // Check if email already exists
      const existingEmail = await User.findOne({ email: googleEmail });
      if (existingEmail) {
        return res.status(400).json(httpMessages.onEmailExistsError);
      }

      userData = {
        firstname,
        lastname,
        email: googleEmail,
        password: null, // No password for Google users
        phone,
        isPhoneVerified: true,
        isEmailVerified: true,
        googleId,
        profilePicture: googleUser.picture
      };

    } else {
      // Email/Password Registration Flow
      if (!name || !email || !password) {
        return res.status(400).json(httpMessages.onValidationError);
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json(httpMessages.onEmailExistsError);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      userData = {
        firstname: name.split(' ')[0] || name,
        lastname: name.split(' ').slice(1).join(' ') || '',
        email,
        password: hashedPassword,
        phone,
        isPhoneVerified: true,
        isEmailVerified: false
      };
    }

    console.log('User data to be saved:', userData);

    // Create user
    const user = new User(userData);
    await user.save();

    // Log the user in immediately after registration
    req.session.userId = user._id;

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: {
        id: user._id,
        name: `${user.firstname} ${user.lastname}`.trim(),
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
}

module.exports = {
  registerUser
};