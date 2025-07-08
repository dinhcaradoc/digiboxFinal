// server/binafsi/services/authentication/login.js
'use strict';
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../../models/user');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function loginUser(req, res, next) {
  const { phone, password, provider, googleToken } = req.body;
  console.log('Login request received:', { phone, provider, googleToken });
  if (provider === 'google' && googleToken) {
    return handleGoogleLogin(req, res, googleToken);
  }
  
  if (!phone || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please enter both phone number and password.'
    });
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || 'Invalid phone number or password.'
      });
    }
    
    // Generate JWT token with user data
    const token = jwt.sign(
      { 
        userId: user._id, 
        phone: user.phone,
        email: user.email,
        name: `${user.firstname} ${user.lastname}`.trim()
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    console.log('Login successful for user:', user._id);
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: token,
      user: {
        id: user._id,
        name: `${user.firstname} ${user.lastname}`.trim(),
        email: user.email,
        phone: user.phone
      }
    });
    
  })(req, res, next);
}

async function handleGoogleLogin(req, res, googleToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this Google email. Please register first.'
      });
    }
    
    const token = jwt.sign(
      { 
        userId: user._id, 
        phone: user.phone,
        email: user.email,
        name: `${user.firstname} ${user.lastname}`.trim()
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Google login successful.',
      token: token,
      user: {
        id: user._id,
        name: `${user.firstname} ${user.lastname}`.trim(),
        email: user.email,
        phone: user.phone
      }
    });
    
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Google login failed. Please try again.'
    });
  }
}

module.exports = { loginUser };