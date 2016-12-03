// dependencies

var express = require('express');
var async = require('async');
var user = require('../models/user.js');
var models = require('../models');
var passport = require('passport');
var crypto = require('crypto');

// import SAT scoring
var SAT = require('../js/sat_scoring.js');

// create the express router
var router = express.Router();

//=============================================
// USER PROFILE
//=============================================
// render a user's profile -- REQUIRES AUTH
router.get('/profile', isLoggedIn, function(req, res) {

    var user = req.user;

    models.SubmittedTest.findAll({
        where: {
            UserId: user.id
        }

    }).then(function(tests) {

        for (var i = 0; i < tests.length; i++) {


            var test = tests[i];

            console.log('test: ' + tests[i]);
           var test = tests[i];

            if (test.id == 1) {
                test.name = "College Board Practice Test 1";
            }
            if (test.id == 2) {
                test.name = "College Board Practice Test 2";
            }
            if (test.id == 3) {
                test.name = "College Board Practice Test 3";
            }
            if (test.id == 4) {
                test.name = "College Board Practice Test 4";
            }
            if (test.id == 5) {
                test.name = "College Board Practice Test 5";
            }
            if (test.id == 6) {
                test.name = "College Board Practice Test 6";
            }
        }
        res.render('profile', {
            user: user,
            tests: tests
        });
    });
});

// });
//=============================================
// LOGIN
//=============================================
// goes to login page
router.get('/login', function(req, res) {

    console.log('\nreq: ' + JSON.stringify(req.session));
    res.render('login', {
        message: req.session.flash
    });
});

// user submits login data
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to profile page
    failureRedirect: '/login', // redirect back to signup page
    failureFlash: true // allow flash messages
}));


models.User.findAll({

}).then(function(user) {

    for (var i = 0; i < user.length; i++) {
        // console.log(user[i]);
        console.log(user[i].dataValues.firstName);
        console.log(user[i].dataValues.lastName);
        console.log(user[i].dataValues.email);

    }
});

//=============================================
// SIGNUP
//=============================================
// goes to sign up page
router.get('/signup', function(req, res) {
    // remember to incorporate flash messages here
    // res.sendFile(process.cwd() + '/public/signup.html');
    res.render('signup', {
        message: req.session.flash
    });
});

// user submits sign up data
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // go to secure profile
    failureRedirect: '/signup', // go back to signup page
    failureFlash: true // allow flash messages
}));

//=============================================
// FORGOT PASSWORD
//=============================================
router.get('/forgot', function(req, res) {
    res.render('forgot', {
        user: req.user,
        message: req.session.flash
    });
});

router.post('/forgot', function(req, res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            models.User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(function(user) {
                console.log('\n made it to user: ' + JSON.stringify(user));
                if (!user) {
                    req.session.flash = {
                        message: 'No account with that email address exists.'
                    };
                    req.session.save(function() {
                        return res.redirect('/forgot');
                    });

                } else {

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save().then(function(user) {
                        console.log('\n Saving user reset token');
                        done(token, user);
                    }).catch(function(err) {
                        console.error(err);

                    });

                }
            });
            // }).catch(function(err){
            //   console.log('\nError: ' + err.stack);
            // });
        },
        function(token, user, done) {
            console.log('\nMailing');
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'SendGrid',
                auth: {
                    user: 'mconstanza',
                    pass: 'SATmodel1'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'mike@satmodel.com',
                subject: 'SAT Model Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) throw err;
        res.redirect('/forgot');
    });
});

router.get('/reset/:token', function(req, res) {
    models.User.findOne({
        where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }
    }).then(function(user) {
        if (!user) {
            req.session.flash = {
                message: 'Password reset token is invalid or has expired.'
            };
            req.session.save(function() {
                return res.redirect('/forgot');
            });
        }
        res.render('reset', {
            user: req.user,
            message: req.session.flash
        });
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            models.User.findOne({
                    where: {
                        resetPasswordToken: req.params.token,
                        resetPasswordExpires: {
                            $gt: Date.now()
                        }
                    }
                })
                .then(function(user) {
                    if (!user) {
                        req.session.flash = {
                            message: 'Password reset token is invalid or has expired.'
                        };
                        req.session.save(function() {
                            return res.redirect('back');
                        });
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'SendGrid',
                auth: {
                    user: 'mconstanza',
                    pass: 'SATmodel1'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'mike@satmodel.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});

//=============================================
// LOGOUT
//=============================================
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if a user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}


// homepage - user is directed to profile if already logged in
router.get('/', function(req, res) {
    // if (isLoggedIn(req, res)) {
    //     res.redirect('/profile');
    // }
    res.sendFile(process.cwd() + '/public/landing.html');
});

//===================================================================
// Utility Functions
//===================================================================

function calculatePercent(part, whole) {
    var percent = Math.floor((part / whole) * 100);
    return percent;
}


module.exports = router;
