// dependencies

var express = require('express');
var user = require('../models/user.js');
var models = require('../models');
var passport = require('passport');

// create the express router
var router = express.Router();

router.get('/test', function(req, res) {
    models.Question.findAll({
            where: {
                practiceTestId: 1
            }
        })
        .then(function(questions) {

            var hbsObj = {
                questions: questions
            };
            res.render('input', hbsObj);
        });
});


// when a user submits answers to a practice test
router.post('/test', function(req, res) {
    var scores = {
        readingRaw: 0,
        writingRaw: 0,
        math1Raw: 0,
        math2Raw: 0
    };

    var answerSheet = req.body;
    //
    //     SAT(answerSheet, function(scores) {
    //         res.send(scores);
    //     });
    // });


    models.Question.findAll({
            where: ['section=? and PracticeTestId=?', 'Evidence-Based-Reading', 1]
        })
        .then(function(questions) {
            var questionArr = questions;

            readingCheck(answerSheet, questionArr, scores);
        })
        .then(function() {
            // get all the writing questions
            models.Question.findAll({
                    where: ['section=? and PracticeTestId=?', 'Writing-and-Language', 1]
                })
                .then(function(questions) {
                    var questionArr = questions;

                    writingCheck(answerSheet, questionArr, scores);

                })
                .then(function() {
                    models.Question.findAll({
                            where: ['section=? and PracticeTestId=?', 'Math1', 1]
                        })
                        .then(function(questions) {
                            var questionArr = questions;
                            math1Check(answerSheet, questionArr, scores);
                        })
                        .then(function() {
                            models.Question.findAll({
                                    where: ['section=? and PracticeTestId=?', 'Math2', 1]
                                })
                                .then(function(questions) {
                                    var questionArr = questions;
                                    math2Check(answerSheet, questionArr, scores);
                                })
                                .then(function() {

                                    console.log('scores in post file: ' + JSON.stringify(scores));
                                    res.send(scores);
                                });
                        });
                });
        });
});

// TEST /////////////////////////////////////////////////////////////////////////////
// get all the reading questions


function readingCheck(answerSheet, questions, scores) {
    // loop through the student's answers
    for (i = 0; i < answerSheet.reading.length; i++) {

        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {

            // if the questions numbers and answers match, add 1 raw point
            if (questions[j].number == i + 1 && answerSheet.reading[i].toLowerCase() == questions[j].answer) {
                console.log('Correct!');
                scores.readingRaw += 1;

            }
        }
    }
    console.log('Reading Score: ' + scores.readingRaw);
    return scores;
}

function writingCheck(answerSheet, questions, scores) {
    // loop through the student's answers
    for (i = 0; i < answerSheet.writing.length; i++) {

        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {

            // if the questions numbers and answers match, add 1 raw point
            if (questions[j].number == i + 1 && answerSheet.writing[i].toLowerCase() == questions[j].answer) {
                console.log('Correct!');
                scores.writingRaw += 1;

            }
        }
    }

    console.log('Writing Score: ' + scores.writingRaw);
    return scores;
}

function math1Check(answerSheet, questions, scores) { // loop through the student's answers
    for (i = 0; i < answerSheet.math1.length; i++) {

        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {


            if (questions[j].questionType == "Open") {
                // special logic for grid ins
            }
            // if the questions numbers and answers match, add 1 raw point
            else if (questions[j].number == i + 1 && answerSheet.math1[i].toLowerCase() == questions[j].answer) {
                console.log('Correct!');
                scores.math1Raw += 1;

            }
        }
    }

    console.log('Math1 Score: ' + scores.math1Raw);
    return scores;
}

function math2Check(answerSheet, questions, scores) {
    // loop through the student's answers
    for (i = 0; i < answerSheet.math2.length; i++) {
        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {
            if (questions[j].questionType == "Open") {
                // special logic for grid ins
            }
            // if the questions numbers and answers match, add 1 raw point
            else if (questions[j].number == i + 1 && answerSheet.math2[i].toLowerCase() == questions[j].answer) {
                console.log('Correct!');
                scores.math2Raw += 1;

            }
        }
    }

    console.log('Math2 Score: ' + scores.math2Raw);
    return scores;
}

function returnScores() {
    console.log('returning values!');
    var scores = {
        readingRaw: readingRaw,
        writingRaw: writingRaw,
        math1Raw: math1Raw,
        math2Raw: math2Raw
    };
    console.log('scores: ' + JSON.stringify(scores));
    return scores;
}




module.exports = router;
