// server.js — Express API backend for DigiBox Chapisha MVP

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');

module.exports = function () {
  const server = express();
  let create, start;

  create = function (config, db) {
    const routes = require('./binafsi/routes');

    // ENV config
    server.set('env', config.env);
    server.set('port', config.port);
    server.set('hostname', config.hostname);

    // Core middleware
    server.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    }));
    server.use(logger('dev'));
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));
    server.use(cookieParser());
    server.use('/public', express.static('public')); // static files if needed

    // Passport JWT (or local if required; sessionless recommended for APIs)
    server.use(passport.initialize());
    // Do NOT call server.use(passport.session()) unless you support session cookies

    // Database connection
    mongoose.connect(db.database, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('connected', () => {
      console.log('Successfully connected to database: ' + `${db.database}`);
    });
    mongoose.connection.on('error', (err) => {
      if (err) console.log(err);
    });

    // Modular route mounting
    routes.init(server);

    // Optional: Global API error handler
    server.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({ message: err.message || 'Server error' });
    });
  };

  start = function () {
    const host = server.get('hostname');
    const port = server.get('port');
    server.listen(port, function () {
      console.log(`Server running on - http://${host}:${port}`);
    });
  };

  return {
    create: create,
    start: start
  };
};