//middleware service to handle requests to the dashboard
'use strict';
const user = require('../../models/user');
const getDoc = require('./getDocs')

function getDashboard(req, res) {
  res.render('home.ejs', { name: username, title: 'Pepe-R' });
};

function getInbox(req, res) {
  res.render('pages/inbox.ejs', { name: username, title: 'Inbox' });
};

function getPriority(req, res) {
  res.render('pages/priority.ejs', { name: username, title: 'Priority Docs' });
};

module.exports = {
  getDashboard: getDashboard,
  getInbox: getInbox,
  getPriority: getPriority
}