// dependencies

var express = require('express');
var user = require('../models/user.js');
var models  = require('../models');
var passport = require('passport');

// create the express router
var router = express.Router();

router.get('/test', function (req, res) {
  models.Question.findAll({where: { practiceTestId: 1}})
  .then(function(questions){
    console.log(questions);
    var hbsObj = {questions:questions};
    res.render('input', questions);
  });
});



module.exports = router;
