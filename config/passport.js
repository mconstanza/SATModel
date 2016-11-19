// config/passport.js

// dependencies
var LocalStrategy = require('passport-local').Strategy;

// load user models

var models = require('../models');
var User = require('../models/user');

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
    passport.deserializeUser(function(id, done) { // may want to go back to deprecated 'done' if this doesn't work
      models.User.findById(id)
      .then(function(user){
        if (user === null) {
          done(new Error('Wrong user id.'));
        }
        done(null, user);
      });
    });

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
    function(req, email, password, done) {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {

      // find a user whose email is the same as the form's email
      // we are checking to see if the user trying to login already exists

        models.User.findOne({where: {'email' : email }})
        .then(function(user) {

          // check to see if there's already a user with that email
          if (user) {
            // need code for if email is taken
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          }else {

            // if no user with that email
            // create the user
            var newUser = models.User.build(
              {
              email: email,
              password: models.User.generateHash(password)
              }
            );
            newUser.save().then(function(err){
              if(err){
                throw err;
              }
              done(null, newUser);
            })
            .catch(function(err) {
              return done(null, err);
            });
          }
        });
      });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
      function(req, email, password, done) {

        // find a user whose email is the same as the form's email to see
        // if the user logging in exists
        models.User.findOne({ where: {'email' : email}})
        .then(function(user) {
          console.log('user: ' + user);
          console.log('password: ' + user.password);

          console.log(user.validPassword(password));
          // if (err)
          //   console.log('error')
          //   return done(err);

          // if no user is found, return the message
          if (!user){
          console.log('no user');
            return done(null, false, {message: 'No User found.'});
          }
          // if the user is found but password is wrong
          else if (!user.validPassword(password)){
            console.log('invalid password');
            return done(null, false, {message:'Oops! Wrong password.'});
          }
          else{
            // all is good
            console.log('made it to the return');
            return done(null, user);
          }
        });
    }));
};
