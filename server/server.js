//This file contains information about the server setup
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const
    express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    engine = require('ejs-locals'),
    layout = require('express-layout'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    multer = require('multer'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bcrypt = require('bcrypt'),
    flash = require('express-flash'),
    session = require('express-session'),
    methodOverride = require('method-override');


module.exports = function () {
    let server = express(),
        create,
        start;

    create = function (config, db) {
        let routes = require('./binafsi/routes');

        //server settings
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        server.engine('ejs', engine);
        server.set('view engine', 'ejs');
        server.set('views', path.join(__dirname, '../views'));


        //Returns middleware that parses json
        server.use(cookieParser());
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(express.urlencoded({ extended: false }));
        server.use(logger('dev'));

        server.use('/public', express.static('public'));

        server.use(flash());
        server.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true
        }));

        server.use(passport.initialize());
        server.use(passport.session());
        server.use(methodOverride('_method'));
        server.use(layout());

        // make user ID available in templates
        server.use(function (req, res, next) {
            res.locals.isAuthenticated = req.session.userId;
            next();
        });

        //set up database connection
        mongoose.connect(db.database, {
            useNewUrlParser: true
        });
        //require('../configs/passport')(passport);

        //On successful database connection
        mongoose.connection.on('connected', () => {
            console.log('Successfully connected to database: ' + `${db.database}`);
        })

        //If database connection unsuccessful
        mongoose.connection.on('error', (err) => {
            if (err) {
                console.log(err)
            }
        });

        //Set up routes
        routes.init(server);
    };

    start = function () {
        let host = server.get('hostname');
        port = server.get('port');

        server.listen(port, function () {
            console.log(`Server running on - http://${host}:${port}`);
        });
    };

    return {
        create: create,
        start: start
    }
}