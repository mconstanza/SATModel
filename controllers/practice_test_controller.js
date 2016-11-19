var express = require('express');
var router = express.Router();
var models = require('../models');
// var Sequelize = require('sequelize');

router.get('/test', function(req, res) {
  models.StudentAnswer.findAll({
    include: [models.StudentAnswer],
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