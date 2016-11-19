var express = require('express');
var router = express.Router();
var models	 = require('../models');
// var Sequelize = require('sequelize');

router.get('/student', function(req, res) {
  models.StudentAnswer.findAll({
    // include: [ models.User ],
    include: [models.PracticeTest],
    include: [models.Question]

  }).then(function(users) {
    // res.render('index', {
    //   title: 'Sequelize: Express Example',
    //   users: users
    // });
    console.log("It works!")
  });
});



module.exports = router;