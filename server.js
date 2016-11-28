// Server

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOR = require('method-override');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

var SequelizeStore = require('connect-session-sequelize')(session.Store);


var app = express();

// public directory for static content
app.use(express.static(process.cwd() + '/public'));

// cookieParser middleware
app.use(cookieParser()); // reads cookie for auth

// bodyParser middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
}));


// bring in our models folder. This brings in the model's object, as defined in index.js
var models = require('./models');

// extract our sequelize connection from the models object, to avoid confusion
var sequelizeConnection = models.sequelize;
/////////////////////////////////////////////////////////////////////////////////////////////
// We run this query so that we can drop our tables even though they have foreign keys
// sequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0')
//
// // a) sync the tables
// .then(function() {
//     return sequelizeConnection.sync({
//         force: true
//     });
// });
// database connection
sequelizeConnection.sync();

// session store to hold users' sessions after login
var sessionStore = new SequelizeStore({
  db: sequelizeConnection
});

// Express Session for passport
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false, // change to true if problems with sequelize-connect
    store: sessionStore

}));

// set up session store to hold user data after login
sessionStore.sync();


// override with POST having ?_method=DELETE
app.use(methodOR('_method'));
// Passport Init

require('./config/passport')(passport); // pass passport for configuration
app.use(flash()); // express-flash for flash messages stored in session


app.use(passport.initialize());
app.use(passport.session());

/////////////////////////////////////////////////////////////////////////////////////////

// handlebars for templating
var hb = require('express-handlebars');
app.engine('handlebars', hb({
    defaultLayout: 'main',
    helpers: {
        if_eq: function(a, b, c, d, opts) {
            if (a == b && c == d) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        }
    }
}));
app.set('view engine', 'handlebars');


// Router ///////////////////////////////////////////////////////////////
// var routes = require('./controllers/main.js');
// app.use('/', routes);
//
var users = require('./controllers/user_controller.js');
app.use('/', users);
//
var tests = require('./controllers/test_controller.js');
app.use('/', tests);

// Server Ready ////////////////////////////////////////////////////////////
var port = process.env.PORT || 3000;
app.listen(port);
console.log('listening on ' + port);

// catch-all handlebars
app.use(function(err, req, res, next) {
    console.log(err);
});
