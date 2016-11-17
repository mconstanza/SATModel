// Server

var express = require('express'),
bodyParser = require('body-parser'),
methodOR = require('method-override');
var passport = require('passport')
var session = require('express-session')  

var app = express();

// public director for static content
app.use(express.static(process.cwd() + '/public'));

// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// bodyParser middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true}));

// override with POST having ?_method=DELETE
app.use(methodOR('_method'));

// bring in our models folder. This brings in the model's object, as defined in index.js
var models  = require('./models');

// extract our sequelize connection from the models object, to avoid confusion
var sequelizeConnection = models.sequelize
/////////////////////////////////////////////////////////////////////////////////////////////
// We run this query so that we can drop our tables even though they have foreign keys
sequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0')

// a) sync the tables
.then(function(){
	return sequelizeConnection.sync({force:true})
})
/////////////////////////////////////////////////////////////////////////////////////////

// handlebars for templating
var hb = require('express-handlebars');
app.engine('handlebars', hb({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Router ///////////////////////////////////////////////////////////////
var routes = require('./controllers/main.js');
app.use('/', routes);

var users = require('./controllers/user_controller.js');
app.use('/users', users);

var tests = require('./controllers/test_controller.js');
app.use('/tests', tests);

// Server Ready ////////////////////////////////////////////////////////////
var port = process.env.PORT || 3000;
app.listen(port);
