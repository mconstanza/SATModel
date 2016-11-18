// config/passport.js

// dependencies
var LocalStrategy = require('passport-local').Strategy;

// load user models

var models = require('../models');

module.exports = function(passport) {

  // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser(function(id, callback) { // may want to go back to deprecated 'done' if this doesn't work
      models.User.findById(id)
      .then(callback(err, user))
    })

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordFeield: 'password',
      passReqToCallback: true // allows us to pass back the entire request to callback
    },
    function(req, email, password) {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {

      // find a user whose email is the same as the form's email
      // we are checking to see if the user trying to login already exists

        models.User.findOne({'local.email' : email })
        .then(function(err, user) {
          // return error if any
          if (err){
            throw err;
          }
          console.log('made it past error')
          // check to see if there's already a user with that email
          if (user) {
            // need code for if email is taken
            console.log('email is already taken')
          }else {

            // if no user with that email
            // create the user
            models.User.create(
              {
              email: email,
              password: password
              }
            );

            console.log('user created')
          }
        });
      });
    }));

}
