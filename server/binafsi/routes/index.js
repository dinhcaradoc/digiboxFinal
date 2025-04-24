/*This file configures routing for the application as a whole.
The home route deals with all requests made prior to user log in.
The App route deals with all requests made post login
*/

const appRoute = require('./app');
//const errorRoute = require('./error');

function init(server) {  //this function creates a log of all url requests, posting this logs on the console 
    server.get('*splat', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    });

    server.use('/', appRoute);
};

module.exports = {
    init: init
}