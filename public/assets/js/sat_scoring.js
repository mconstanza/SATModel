// import the models in order to pull from the database
var models = require('../../../models');

var async = require('async');

var readingRaw = 0;
var writingRaw = 0;
var math1Raw = 0;
var math2Raw = 0;

// counter to deal with asynchronous behavior
var scoresToCalculate = 4;

module.exports = function(answerSheet) {
    // check the answers against thes scores from the database and total the raw scores

    models.Question.findAll({
            where: ['section=? and PracticeTestId=?', 'Evidence-Based-Reading', 1]
        })
        .then(function(questions) {
            var questionArr = questions;

            readingCheck(answerSheet, questionArr);

        })
        .then(function() {
            // get all the writing questions
            models.Question.findAll({
                    where: ['section=? and PracticeTestId=?', 'Writing-and-Language', 1]
                })
                .then(function(questions) {
                    var questionArr = questions;

                    writingCheck(answerSheet, questionArr);

                })
                .then(function() {
                    models.Question.findAll({
                            where: ['section=? and PracticeTestId=?', 'Math1', 1]
                        })
                        .then(function(questions) {
                            var questionArr = questions;
                            math1Check(answerSheet, questionArr);
                        })
                        .then(function() {
                            models.Question.findAll({
                                    where: ['section=? and PracticeTestId=?', 'Math2', 1]
                                })
                                .then(function(questions) {
                                    var questionArr = questions;
                                    math2Check(answerSheet, questionArr);
                                    returnScores();
                                });
                        });
                });
        });
};



// get all the reading questions


function readingCheck(answerSheet, questions) {
    // loop through the student's answers
    for (i = 0; i < answerSheet.reading.length; i++) {

        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {

            // if the questions numbers and answers match, add 1 raw point
            if (questions[j].number == i + 1 && answerSheet.reading[i].toLowerCase() == questions[j].answer) {
                console.log('Correct!');
                readingRaw += 1;

            }
        }
    }
    scoresToCalculate -= 1;
    console.log('Reading Score: ' + readingRaw);
}

function writingCheck(answerSheet, questions) {
    // loop through the student's answers
    for (i = 0; i < answerSheet.writing.length; i++) {

        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {

            // if the questions numbers and answers match, add 1 raw point
            if (questions[j].number == i + 1 && answerSheet.writing[i].toLowerCase() == questions[j].answer) {
                console.log('Correct!');
                writingRaw += 1;

            }
        }
    }
    scoresToCalculate -= 1;
    console.log('Writing Score: ' + writingRaw);
}

function math1Check(answerSheet, questions) { // loop through the student's answers
    for (i = 0; i < answerSheet.math1.length; i++) {

        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {


            if (questions[j].questionType == "Open") {
                // special logic for grid ins
            }
            // if the questions numbers and answers match, add 1 raw point
            else if (questions[j].number == i + 1 && answerSheet.math1[i].toLowerCase() == questions[j].answer) {
                console.log('Correct!');
                math1Raw += 1;

            }
        }
    }
    scoresToCalculate -= 1;
    console.log('Math1 Score: ' + math1Raw);
}

function math2Check(answerSheet, questions) {
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
                math2Raw += 1;

            }
        }
    }
    scoresToCalculate -= 1;
    console.log('Math2 Score: ' + math2Raw);
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
