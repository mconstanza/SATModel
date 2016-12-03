// dependencies

var express = require('express');
var user = require('../models/user.js');
var models = require('../models');
var passport = require('passport');


var async = require('async');

// create the express router
var router = express.Router();

router.get('/test/:id', function(req, res) {

    models.Question.findAll({
            where: {
                practiceTestId: req.params.id
            }
        })
        .then(function(questions) {

            var hbsObj = {
                layout: 'main.handlebars',
                questions: questions
            };
            res.render('input', hbsObj);
        });
});

// --------------------------------------------------------------
// When a user submits answers to a practice test
// --------------------------------------------------------------
router.post('/test/:id', function(req, res) {
    var scores = {
        readingRaw: 0,
        writingRaw: 0,
        math1Raw: 0,
        math2Raw: 0,
        readingTest: 0,
        writingTest: 0,
        mathTest: 0,
        readingScaled: 0,
        mathScaled: 0,

        expressionOfIdeasRaw: 0,
        standardEnglishConventionsRaw: 0,
        heartOfAlgebraRaw: 0,
        problemSolvingDataAnalysisRaw: 0,
        passportToAdvMathRaw: 0,
        wordsInContextRaw: 0,
        commandOfEvidenceRaw: 0,
        historyRaw: 0,
        scienceRaw: 0,

        expressionOfIdeas: 0,
        standardEnglishConventions: 0,
        heartOfAlgebra: 0,
        problemSolvingDataAnalysis: 0,
        passportToAdvMath: 0,
        wordsInContext: 0,
        commandOfEvidence: 0,
        history: 0,
        science: 0
    };

    var answerSheet = req.body;

    console.log('\nreq on test page: ' + JSON.stringify(req.session.passport.user) + '\n');

    var user = req.session.passport.user;

    //Start the Waterfall
    var _PracticeTestId = req.params.id;
    var _UserId = user.id;
    var _currentTest = [];

    async.waterfall([
        firstCallback,
        createSubmittedTest,
        saveStudentAnswers,
        getQuestionsSection1,
        getQuestionsSection2,
        getQuestionsSection3,
        getQuestionsSection4,
        getScaledScores,
        updateCurrTest,
    ], function(err, result) {
        res.send(result);
    });

    // all the waterfall handler functions
    function firstCallback(callback) {
        callback(null, _PracticeTestId, _UserId);
    }

    function createSubmittedTest(practiceid, userid, callback) {
        models.SubmittedTest.create({
            PracticeTestId: practiceid,
            UserId: userid
        }).then(function(currentTest) {
            _currentTest = currentTest;
            var ans = saveAnswers(answerSheet, currentTest.PracticeTestId, currentTest.UserId, currentTest.id);
            callback(null, ans, currentTest, practiceid);
        });
    }

    function saveStudentAnswers(answers, currentTest, practiceid, callback) {
        models.StudentAnswer.bulkCreate(answers, ['answer', 'PracticeTestId', 'QuestionId', 'UserId', 'SubmittedTestId'])
            .then(function() {
                callback(null, answers, practiceid);
            });
    }

    function getQuestionsSection1(answers, practiceid, callback) {
        models.Question.findAll({
                where: ['section=? and PracticeTestId=?', '1', practiceid]
            })
            .then(function(questions) {
                var questionArr = questions;
                readingCheck(answerSheet, questionArr, scores);
                callback(null, answers, practiceid);
            });
    }

    function getQuestionsSection2(answers, practiceid, callback) {
        models.Question.findAll({
                where: ['section=? and PracticeTestId=?', '2', practiceid]
            })
            .then(function(questions) {
                var questionArr = questions;
                writingCheck(answerSheet, questionArr, scores);
                callback(null, answers, practiceid);
            });
    }

    function getQuestionsSection3(answers, practiceid, callback) {
        models.Question.findAll({
                where: ['section=? and PracticeTestId=?', '3', practiceid]
            })
            .then(function(questions) {
                var questionArr = questions;
                math1Check(answerSheet, questionArr, scores);
                callback(null, answers, practiceid);
            });
    }

    function getQuestionsSection4(answers, practiceid, callback) {
        models.Question.findAll({
                where: ['section=? and PracticeTestId=?', '4', practiceid]
            })
            .then(function(questions) {
                var questionArr = questions;
                math2Check(answerSheet, questionArr, scores);
                callback(null, _currentTest, practiceid);
            });
    }

    function getScaledScores(currentTest, practiceid, callback) {
        models.ScaledScoreTable.findAll({
            where: {
                PracticeTestId: practiceid
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

                //crossscore/category scaled scores
                if (scaledScores[i].rawScore == scores.wordsInContextRaw)
                    scores.wordsInContext = scaledScores[i].wordsInContext;
                if (scaledScores[i].rawScore == scores.standardEnglishConventionsRaw)
                    scores.standardEnglishConventions = scaledScores[i].standardEnglishConventions;
                if (scaledScores[i].rawScore == scores.expressionOfIdeasRaw)
                    scores.expressionOfIdeas = scaledScores[i].expressionOfIdeas;
                if (scaledScores[i].rawScore == scores.heartOfAlgebraRaw)
                    scores.heartOfAlgebra = scaledScores[i].heartOfAlgebra;
                if (scaledScores[i].rawScore == scores.problemSolvingDataAnalysisRaw)
                    scores.problemSolvingDataAnalysis = scaledScores[i].problemSolvingDataAnalysis;
                if (scaledScores[i].rawScore == scores.passportToAdvMathRaw)
                    scores.passportToAdvMath = scaledScores[i].passportToAdvMath;
                if (scaledScores[i].rawScore == scores.commandOfEvidenceRaw)
                    scores.commandOfEvidence = scaledScores[i].commandOfEvidence;
                if (scaledScores[i].rawScore == scores.historyRaw)
                    scores.history = scaledScores[i].history;
                if (scaledScores[i].rawScore == scores.scienceRaw)
                    scores.science = scaledScores[i].science;

            }
            scores.readingScaled = (scores.readingTest + scores.writingTest) * 10;
            req.session.passport.user.currentTest = currentTest.id;
            callback(null, currentTest);
        });
    }

    function updateCurrTest(currentTest, callback) {
        currentTest.update({
                readingRaw: scores.readingRaw,
                writingRaw: scores.writingRaw,
                math1Raw: scores.math1Raw,
                math2Raw: scores.math2Raw,
                readingTest: scores.readingTest,
                writingTest: scores.writingTest,
                mathTest: scores.mathTest,
                readingScaled: scores.readingScaled,
                mathScaled: scores.mathScaled,

                //  Update new fields
                expressionOfIdeas: scores.expressionOfIdeas,
                standardEnglishConventions: scores.standardEnglishConventions,
                heartOfAlgebra: scores.heartOfAlgebra,
                problemSolvingDataAnalysis: scores.problemSolvingDataAnalysis,
                passportToAdvMath: scores.passportToAdvMath,
                wordsInContext: scores.wordsInContext,
                commandOfEvidence: scores.commandOfEvidence,
                history: scores.history,
                science: scores.science

            })
            .then(function(currentTest) {
                var data = {
                    url: '/report/' + currentTest.id
                };
                console.log(currentTest.id);
                console.log(data);
                callback(null, data);
            });
    }

});

// report router
router.get('/report/:id', function(req, res) {

    var testId = req.params.id;
    var user = req.user;

    models.SubmittedTest.findOne({
        where: {
            id: testId
        }

    }).then(function(test) {


        // Getting scaled score perecentages and adding to object for rendering
        test.readingTestPercent = calculatePercent(test.readingTest, 40);
        test.writingTestPercent = calculatePercent(test.writingTest, 40);
        test.mathTestPercent = calculatePercent(test.mathTest, 40);
        test.expressionOfIdeasPercent = calculatePercent(test.expressionOfIdeas, 15);
        test.standardEnglishConventionsPercent = calculatePercent(test.standardEnglishConventions, 15);
        test.heartOfAlgebraPercent = calculatePercent(test.heartOfAlgebra, 15);
        test.problemSolvingDataAnalysisPercent = calculatePercent(test.problemSolvingDataAnalysis, 15);
        test.passportToAdvMathPercent = calculatePercent(test.passportToAdvMath, 15);
        test.wordsInContextPercent = calculatePercent(test.wordsInContext, 15);
        test.commandOfEvidencePercent = calculatePercent(test.commandOfEvidence, 15);
        test.historyPercent = calculatePercent(test.history, 40);
        test.sciencePercent = calculatePercent(test.science, 40);

        test.total = test.readingScaled + test.mathScaled;

        console.log('\nscores in report route: ' + JSON.stringify(test));

        res.render('report', {
            layout: 'reportLayout.handlebars',
            scores: test,
            user: user
        });
    });

});

// Save Questions to StudentAnswer Table ////////////////////////////////////////////
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
                calcCrossScore(questions[j], scores);
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
                calcCrossScore(questions[j], scores);
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
                if (questions[j].answerType == "fraction") {
                    // fraction answer possibilities are separated by commas in the database
                    var answers = questions[j].answer.split(',');
                    for (var k = 0; k < answers.length; k++) {
                        if (answerSheet.math1[i] == answers[k]) {
                            scores.math1Raw += 1;
                            calcCrossScore(questions[j], scores);
                        }
                    }
                }
                if (questions[j].answerType == "range") {
                    // lower and upper range limits are separated by commas in the database
                    var answers = questions[j].answer.split(',');

                    if (answerSheet.math1[i] > answers[0] && answerSheet.math1[i] < answers[1]) {
                        scores.math1Raw += 1;
                        calcCrossScore(questions[j], scores);
                    }

                }
                if (questions[j].answerType == "multiple") {
                    // fraction answer possibilities are separated by commas in the database
                    var answers = questions[j].answer.split(',');
                    for (var k = 0; k < answers.length; k++) {
                        if (answerSheet.math1[i] == answers[k]) {
                            scores.math1Raw += 1;
                            calcCrossScore(questions[j], scores);
                        }
                    }
                }
            }
            // if the questions numbers and answers match, add 1 raw point
            else if (questions[j].number == i + 1 && answerSheet.math1[i].toLowerCase() == questions[j].answer) {
                console.log('Correct!');
                scores.math1Raw += 1;
                calcCrossScore(questions[j], scores);
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
                if (questions[j].answerType == "fraction") {

                    // fraction answer possibilities are separated by commas in the database
                    var answers = questions[j].answer.split(',');
                    for (var k = 0; k < answers.length; k++) {
                        if (answerSheet.math2[i] == answers[k]) {
                            scores.math2Raw += 1;
                            calcCrossScore(questions[j], scores);
                        }
                    }
                }
                if (questions[j].answerType == "range") {
                    // lower and upper range limits are separated by commas in the database
                    var answers = questions[j].answer.split(',');

                    if (answerSheet.math2[i] > answers[0] && answerSheet.math2[i] < answers[1]) {
                        scores.math2Raw += 1;
                        calcCrossScore(questions[j], scores);
                    }

                }
                if (questions[j].answerType == "multiple") {
                    // fraction answer possibilities are separated by commas in the database
                    var answers = questions[j].answer.split(',');
                    for (var k = 0; k < answers.length; k++) {
                        if (answerSheet.math2[i] == answers[k]) {
                            scores.math2Raw += 1;
                            calcCrossScore(questions[j], scores);
                        }
                    }
                }
            }
            // if the questions numbers and answers match, add 1 raw point
            else if (questions[j].number == i + 1 && answerSheet.math2[i].toLowerCase() == questions[j].answer) {
                console.log('Correct!');
                scores.math2Raw += 1;
                calcCrossScore(questions[j], scores);
            }
        }
    }

    console.log('Math2 Score: ' + scores.math2Raw);
    return scores;
}

//updates scores with the appropriate subscore, category, and crosstest subtotals
function calcCrossScore(questions, scores) {

    if (questions.subScore == "Words in Context")
        scores.wordsInContextRaw += 1;
    if (questions.subScore == "Command of Evidence")
        scores.commandOfEvidenceRaw += 1;
    if (questions.category == "Standard English Conventions")
        scores.standardEnglishConventionsRaw += 1;
    if (questions.category == "Expression of Ideas")
        scores.expressionOfIdeasRaw += 1;
    if (questions.category == "Heart of Algebra")
        scores.heartOfAlgebraRaw += 1;
    if (questions.category == "Problem Solving and Data Analysis")
        scores.problemSolvingDataAnalysisRaw += 1;
    if (questions.category == "Passport to Advaced Mathematics")
        scores.passportToAdvMathRaw += 1;
    if (questions.crossTest == "History")
        scores.historyRaw += 1;
    if (questions.crossTest == "Science")
        scores.scienceRaw += 1;
}

function returnScores() {
    console.log('returning values!');
    var scores = {
        readingRaw: readingRaw,
        writingRaw: writingRaw,
        math1Raw: math1Raw,
        math2Raw: math2Raw,
    };
    // console.log('scores: ' + JSON.stringify(scores));
    return scores;
}

//===================================================================
// Utility Functions
//===================================================================

function calculatePercent(part, whole) {
    var percent = Math.floor((part / whole) * 100);
    return percent;
}

module.exports = router;
