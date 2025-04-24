//APP SETUP
const
	server = require('./server')()
	config = require('./configs'),
	db = require('./configs/db');

server.create(config, db);
server.start();