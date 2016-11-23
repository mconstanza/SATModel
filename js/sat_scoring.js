// import the models in order to pull from the database
var models = require('../models');

module.exports = function(answerSheet) {

    var scores = {
        readingRaw: 0,
        writingRaw: 0,
        math1Raw: 0,
        math2Raw: 0
    };
    // check the answers against thes scores from the database and total the raw scores

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
                                    returnScores(scores);
                                });
                        });
                });
        });
};


// get all the reading questions


function readingCheck(answerSheet, questions, scores) {
    // loop through the student's answers
    for (i = 0; i < answerSheet.reading.length; i++) {

        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {

            // if the questions numbers and answers match, add 1 raw point
            if (questions[j].number == i + 1 && answerSheet.reading[i].toLowerCase() == questions[j].answer) {

                scores.readingRaw += 1;

            }
        }
    }
    console.log('Reading Score: ' + scores.readingRaw);
}

function writingCheck(answerSheet, questions, scores) {
    // loop through the student's answers
    for (i = 0; i < answerSheet.writing.length; i++) {

        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {

            // if the questions numbers and answers match, add 1 raw point
            if (questions[j].number == i + 1 && answerSheet.writing[i].toLowerCase() == questions[j].answer) {

                scores.writingRaw += 1;

            }
        }
    }
    console.log('Writing Score: ' + scores.writingRaw);
}

function math1Check(answerSheet, questions, scores) { // loop through the student's answers
    for (i = 0; i < answerSheet.math1.length; i++) {

        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {

            // If the question is a gridin
            if (questions[j].questionType == "Open") {

                // possible answer choices for gridin questions are separated by commas
                var answers = questions[j].split(',');

                // loop through the different answers and check if one of them matches the user's answer
                for (k = 0; k < answers.length; k++) {
                    if (answers[k] == answerSheet.math1[i]) {
                        scores.math1Raw += 1;
                        break;
                    }
                }

            }
            // if the questions numbers and answers match, add 1 raw point
            else if (questions[j].number == i + 1 && answerSheet.math1[i].toLowerCase() == questions[j].answer) {

                scores.math1Raw += 1;

            }
        }
    }

    console.log('Math1 Score: ' + scores.math1Raw);
}

function math2Check(answerSheet, questions, scores) {
    // loop through the student's answers
    for (i = 0; i < answerSheet.math2.length; i++) {
        // loop through the questions pulled from the database
        for (j = 0; j < questions.length; j++) {
            // If the question is a gridin
            if (questions[j].questionType == "Open") {

                // possible answer choices for gridin questions are separated by commas
                var answers = questions[j].split(',');

                // loop through the different answers and check if one of them matches the user's answer
                for (k = 0; k < answers.length; k++) {
                    if (answers[k] == answerSheet.math1[i]) {
                        scores.math1Raw += 1;
                        break;
                    }
                }

            }
            // if the questions numbers and answers match, add 1 raw point
            else if (questions[j].number == i + 1 && answerSheet.math2[i].toLowerCase() == questions[j].answer) {

                scores.math2Raw += 1;

            }
        }
    }
    console.log('Math2 Score: ' + scores.math2Raw);
}

function returnScores(scores) {
    console.log('returning values!');

    console.log('scores: ' + JSON.stringify(scores));
    return scores;
}
