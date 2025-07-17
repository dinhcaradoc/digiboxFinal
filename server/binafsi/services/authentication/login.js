// server/binafsi/services/authentication/login.js
'use strict';
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function loginUser(req, res) {
  const { phone, password, provider, googleToken } = req.body;
  try {
    // Google login
    if (provider === 'google' && googleToken) {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const user = await User.findOne({ email: payload.email });
      if (!user)
        return res.status(404).json({ success: false, message: 'No account found with this Google email. Please register first.' });

      const token = jwt.sign(
        { userId: user._id, phone: user.phone, email: user.email, name: `${user.firstname} ${user.lastname}`.trim() },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      return res.status(200).json({
        success: true,
        message: 'Google login successful.',
        token,
        user: {
          id: user._id,
          name: `${user.firstname} ${user.lastname}`.trim(),
          email: user.email,
          phone: user.phone
        }
      });
    }

    // Standard login
    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Phone and password are required.' });
    }

    const user = await User.findOne({ phone });
    if (!user || !user.password)
      return res.status(401).json({ success: false, message: 'Invalid phone number or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid phone number or password.' });

    const token = jwt.sign(
      { userId: user._id, phone: user.phone, email: user.email, name: `${user.firstname} ${user.lastname}`.trim() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: `${user.firstname} ${user.lastname}`.trim(),
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
}

module.exports = { loginUser };
