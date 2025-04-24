//This controller handles routing requests made on the dashboard
'use strict';
const passport = require('passport');
const express = require('express');
const dashboardService = require('../../services/dashboard/dashboard');

let router = express.Router();

//router.get('/', passport.authenticate('jwt', { session: false }), dashboardService.getDashboard);

router.get('/', dashboardService.getDashboard);

router.get('/inbox', dashboardService.getInbox);

router.get('/priority', dashboardService.getPriority);

module.exports = router;