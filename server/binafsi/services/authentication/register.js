// Authentication middleware for handling registration requests
'use strict';

const User = require('../../models/user');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const httpMessages = {
  onValidationError: { success: false, message: 'Please enter all required fields.' },
  onEmailExistsError: { success: false, message: 'That email is already in use' },
  onPhoneExistsError: { success: false, message: 'That phone number is already in use' },
};

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      googleId: payload.sub,
      email: payload.email,
      firstname: payload.given_name,
      lastname: payload.family_name,
      picture: payload.picture
    };
  } catch (err) {
    console.error('Failed to verify Google token:', err);
    return null;
  }
}

async function registerUser(req, res) {
  try {
    const { name, email, password, phone, provider, googleToken } = req.body;

    // Validate phone: required, flexible + optional
    if (!phone || !/^\+?\d{10,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });
    }

    if (await User.findOne({ phone })) {
      return res.status(400).json(httpMessages.onPhoneExistsError);
    }

    let userData;

    if (provider === 'google' && googleToken) {
      const googleUser = await verifyGoogleToken(googleToken);
      if (!googleUser) {
        return res.status(400).json({ success: false, message: 'Invalid Google token.' });
      }

      const { email: googleEmail, firstname, lastname, googleId, picture } = googleUser;

      if (await User.findOne({ email: googleEmail })) {
        return res.status(400).json(httpMessages.onEmailExistsError);
      }

      userData = {
        firstname,
        lastname,
        email: googleEmail,
        password: null,
        phone,
        isPhoneVerified: true,
        isEmailVerified: true,
        googleId,
        profilePicture: picture
      };

    } else {
      // Standard registration
      if (!name || !email || !password) {
        return res.status(400).json(httpMessages.onValidationError);
      }

      if (await User.findOne({ email })) {
        return res.status(400).json(httpMessages.onEmailExistsError);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      userData = {
        firstname: name.split(' ')[0],
        lastname: name.split(' ').slice(1).join(' ') || '',
        email,
        password: hashedPassword,
        phone,
        isPhoneVerified: true,
        isEmailVerified: false
      };
    }

    const user = new User(userData);
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'User created successfully. Please log in.',
      user: {
        id: user._id,
        name: `${user.firstname} ${user.lastname}`.trim(),
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
}

module.exports = { registerUser };