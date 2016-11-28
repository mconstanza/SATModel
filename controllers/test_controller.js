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
        math2Raw: 0,
        readingTest: 0,
        writingTest: 0,
        mathTest: 0,
        readingScaled: 0,
        mathScaled: 0
    };

    var answerSheet = req.body;

    //Save data to StudentAnswer table with bulkCreate
    // ToDo: replace hard coded parameters with praticeId, userId (i.e. router.post('/test/:PracticeTestId/:UserId ...'))

    console.log('\nreq on test page: ' + JSON.stringify(req.session.passport.user) + '\n');

    var user = req.session.passport.user;

    models.SubmittedTest.create({
        PracticeTestId: answerSheet.testId,
        UserId: user.id
    }).then(function(currentTest) {

        console.log('\ncurrent test: ' + JSON.stringify(currentTest) + '\n');

        var answers = saveAnswers(answerSheet, currentTest.PracticeTestId, currentTest.UserId, currentTest.id);
        models.StudentAnswer.bulkCreate(answers, ['answer', 'PracticeTestId', 'QuestionId', 'UserId', 'SubmittedTestId'])
            .then(function() {

                models.Question.findAll({
                        where: ['section=? and PracticeTestId=?', '1', 1]
                    })
                    .then(function(questions) {
                        var questionArr = questions;

                        readingCheck(answerSheet, questionArr, scores);
                    })
                    .then(function() {
                        // get all the writing questions
                        models.Question.findAll({
                                where: ['section=? and PracticeTestId=?', '2', 1]
                            })
                            .then(function(questions) {
                                var questionArr = questions;

                                writingCheck(answerSheet, questionArr, scores);

                            })
                            .then(function() {
                                models.Question.findAll({
                                        where: ['section=? and PracticeTestId=?', '3', 1]
                                    })
                                    .then(function(questions) {
                                        var questionArr = questions;
                                        math1Check(answerSheet, questionArr, scores);
                                    })
                                    .then(function() {
                                        models.Question.findAll({
                                                where: ['section=? and PracticeTestId=?', '4', 1]
                                            })
                                            .then(function(questions) {
                                                var questionArr = questions;
                                                math2Check(answerSheet, questionArr, scores);
                                            })
                                            .then(function() {
                                                models.ScaledScoreTable.findAll({
                                                    where: {
                                                        PracticeTestId: currentTest.PracticeTestId
                                                    }
                                                })

                                                .then(function(scaledScores) {

                                                  console.log('\nScores in scaled score function: ' + JSON.stringify(scores) + '\n');
                                                  console.log('Scaled scores: ' + JSON.stringify(scaledScores) + '\n');

                                                    for (var i = 0; i < scaledScores.length; i++) {
                                                        if (scaledScores[i].rawScore == scores.readingRaw) {
                                                            scores.readingTest = scaledScores[i].readingScore;
                                                        }
                                                        if (scaledScores[i].rawScore == scores.writingRaw) {
                                                            scores.writingTest = scaledScores[i].writingScore;
                                                        }
                                                        if (scaledScores[i].rawScore == scores.math1Raw + scores.math2Raw) {
                                                            scores.mathScaled = scaledScores[i].mathScore;
                                                            scores.mathTest = scores.mathScaled / 20;
                                                        }

                                                    }
                                                    scores.readingScaled = (scores.readingTest + scores.writingTest) * 10;

                                                    req.session.passport.user.currentTest = currentTest.id;

                                                    console.log('\nscaled scores: ' + JSON.stringify(scores) + '\n');
                                                    currentTest.update({
                                                            readingRaw: scores.readingRaw,
                                                            writingRaw: scores.writingRaw,
                                                            math1Raw: scores.math1Raw,
                                                            math2Raw: scores.math2Raw,
                                                            readingTest: scores.readingTest,
                                                            writingTest: scores.writingTest,
                                                            mathTest: scores.mathTest,
                                                            readingScaled: scores.readingScaled,
                                                            mathScaled: scores.mathScaled
                                                        })
                                                        .then(function(currentTest) {
                                                            var data = {
                                                                url: '/report/' + currentTest.id
                                                            };

                                                            res.send(data);

                                                        });
                                                });
                                            });
                                    });
                            });
                    });
            });
    });
});


// report router
router.get('/report/:id', function(req, res) {

    var testId = req.params.id;

    console.log('\nid: ' + testId);

    models.SubmittedTest.findOne({
      where: {
        id: testId
      }

    }).then(function(test) {
      console.log('\nscores in report route: ' + JSON.stringify(test));
      res.render('report', {
          layout: 'reportLayout.handlebars',
          scores: test
      });
    });

});


// Save Questions to StudentAnswer Table ////////////////////////////////////////////
//
// Currently coded specifically for
function saveAnswers(answerTable, practiceId, userId, submittedTestId) {
    var data = answerTable;
    var answers = [];

    var oAnswers = function(answer, PracticeTestId, QuestionId, UserId, submittedTestId) {
        this.answer = answer.toLowerCase();
        this.PracticeTestId = PracticeTestId;
        this.QuestionId = QuestionId;
        this.UserId = UserId;
        this.SubmittedTestId = submittedTestId;
    };

    for (var i = 0; i < data.reading.length; i++) {
        answers.push(new oAnswers(data.reading[i], practiceId, i + 1, userId, submittedTestId));
    }
    for (var i = 0; i < data.writing.length; i++) {
        answers.push(new oAnswers(data.writing[i], practiceId, i + 53, userId, submittedTestId));
    }
    for (var i = 0; i < data.math1.length; i++) {
        answers.push(new oAnswers(data.math1[i], practiceId, i + 97, userId, submittedTestId));
    }
    for (var i = 0; i < data.math2.length; i++) {
        answers.push(new oAnswers(data.math2[i], practiceId, i + 117, userId, submittedTestId));
    }

    return answers;
}
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
    // console.log('scores: ' + JSON.stringify(scores));
    return scores;
}




module.exports = router;
