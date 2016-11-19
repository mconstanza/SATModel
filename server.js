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
// sequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0')
//
// // a) sync the tables
// .then(function(){
// 	return sequelizeConnection.sync({force:true})
// })

// sequelizeConnection.sync({force: true})

.then(function(){
	return models.User.create({
		firstName: "Blah",
		lastName: "Foo",
		userName: "BlahFoo",
		password: "random",
		email: "blahfoo@random.com"
	})
});
/////////////////////////////////////////////////////////////////////////////////////////

// handlebars for templating
var hb = require('express-handlebars');
app.engine('handlebars', hb({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Router ///////////////////////////////////////////////////////////////
var routes = require('./controllers/practice_test_controller.js');
app.use('/', routes);
//
// var users = require('./controllers/question_controller.js');
// app.use('/question', users);
//
var tests = require('./controllers/student_answer_controller.js');
app.use('/student', tests);

// Server Ready ////////////////////////////////////////////////////////////
var port = process.env.PORT || 3000;
app.listen(port);
