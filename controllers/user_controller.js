// dependencies

var express = require('express');
var user = require('../models/user.js');
var models  = require('../models');
var passport = require('passport');

// create the express router
var router = express.Router();

// DEVELOPMENT -- remove in final product
router.get('/users', function (req, res) {
  models.User.findAll()
  .then(function(users){
    console.log(users);
    res.send(users);
  });
});

//=============================================
// USER PROFILE
//=============================================
// render a user's profile -- REQUIRES AUTH
router.get('/profile', isLoggedIn, function (req, res) {
  res.render('user.handlebars', {
    user:req.user   // get the user out of session and pass to template
  });
});
//=============================================
// LOGIN
//=============================================
// goes to login page
router.get('/login', function (req, res) {
  // remember to incorporate flash messages here
});

// user submits login data
router.post('/login', function (req, res) {

});
//=============================================
// SIGNUP
//=============================================
// goes to sign up page
router.get('/signup', function (req, res) {
  // remember to incorporate flash messages here
  res.sendFile(process.cwd() + '/public/test_signup.html')
});

// user submits sign up data
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile', // go to secure profile
  failureRedirect: '/signup', // go back to signup page
  failureFlash: true // allow flash messages
}));

//=============================================
//LOGOUT
//=============================================
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if a user is authenticated in the session, carry on
  if (req.isAuthenticated())
  return next();

  // if they aren't, redirect to home page
  res.redirect('/');
}

router.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/public/landing.html')
})


module.exports = router;
