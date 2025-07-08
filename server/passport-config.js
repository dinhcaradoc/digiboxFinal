// passport-config.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./binafsi/models/user');

function initialize(passport, getUserByPhone, getUserById) {
  async function authenticateUser(phone, password, done) {
    try {
      const user = await User.findOne({ phone: phone });
      if (!user) {
        return done(null, false, { message: 'No user with that phone number' });
      }

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (error) {
      return done(error);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'phone' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
