//Environment configuration
const _ = require('lodash');
env = process.env.NODE_ENV || 'local';

let envConfig;

if (env === 'production') {
  envConfig = require('./production');
} else {
  envConfig = require('./' + env);
};

let defaultConfig = {
	env: env
};

module.exports = _.merge(defaultConfig, envConfig);