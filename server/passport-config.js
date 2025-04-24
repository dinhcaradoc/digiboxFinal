//This file is used to achieve all configuration for passport

//Use local version of passport
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./binafsi/models/user');

function initialize(passport, getUserByPhone, getUserById) {
  async function authenticateUser(phone, password, done) {
    const user = await User.findOne({ phone: phone })
    if (user == null) {
      return done(null, false, { message: 'No user with that phone number' });
    }

    try {

      if (await bcrypt.compare(password, user.password)) {
        userId = user._id
        username = user.lastname
        userNum = user.phone
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (error) {
      return done(error);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'phone' },  //defines the username field
    authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  });
}

module.exports = initialize;