//APP SETUP
const
	server = require('./server')()
	config = require('./configs'),
	db = require('./configs/db'),
	{ startCleanupJob } = require('./jobs/cleanup');

startCleanupJob();
server.create(config, db);
server.start();