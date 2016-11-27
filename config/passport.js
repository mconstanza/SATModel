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
        var sessionUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
        done(null, sessionUser);
    });

    // deserialize the user
    passport.deserializeUser(function(sessionUser, done) { // may want to go back to deprecated 'done' if this doesn't work
        // models.User.findById(id)
        //     .then(function(user) {
        //         if (user === null) {
        //             done(new Error('Wrong user id.'));
        //         }
        done(null, sessionUser);
    });
    // });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to callback
        },
        function(req, email, password, done) {
            // asynchronous
            // User.findOne wont fire unless data is sent back
            var request = req;
            process.nextTick(function() {

                // find a user whose email is the same as the form's email
                // we are checking to see if the user trying to login already exists
                console.log(req.body);
                models.User.findOne({
                        where: {
                            'email': email.toLowerCase()
                        }
                    })
                    .then(function(user) {

                        // check to see if there's already a user with that email
                        if (user) {
                          req.session.flash = {
                              message: 'That email is already taken.'
                          };
                          req.session.save(function() {
                              return done(null, false);
                          });

                        } else {

                            // if no user with that email
                            // create the user
                            var newUser = models.User.build({
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: email.toLowerCase(),
                                password: models.User.generateHash(password)
                            });
                            newUser.save().then(function(err) {
                                    if (err) {
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
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            // find a user whose email is the same as the form's email to see
            // if the user logging in exists
            models.User.findOne({
                    where: {
                        'email': email.toLowerCase()
                    }
                })
                .then(function(user, err) {
                    // console.log('user: ' + user);
                    // console.log('password: ' + user.password);
                    //
                    // console.log(user.validPassword(password));
                    if (err) {
                        console.log('error');
                        return done(err);
                    }

                    // if no user is found, return the message
                    if (!user) {
                        console.log('\nno user\n');
                        // return done(null, false, {message: 'No user with that email found.' });
                        // return done(null, false, req.flash('message', 'No user with that email found.'));
                        req.session.flash = {
                            message: 'No user with that email found.'
                        };
                        req.session.save(function() {
                            return done(null, false);
                        });



                    }
                    // if the user is found but password is wrong
                    else if (!user.validPassword(password)) {
                        console.log('\ninvalid password\n');
                        // return done(null, false, {message: 'Invalid password.'});
                        req.session.flash = {
                            message: 'Invalid password.'
                        };
                        // return done(null, false, req.flash('message', 'Invalid password.'));
                        req.session.save(function() {
                            return done(null, false);
                        });


                    } else {
                        // all is good
                        console.log('\nlog in successful\n');
                        return done(null, user);
                    }
                });
        }));
};
