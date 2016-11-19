var models  = require('../models');
var express = require('express');
var router  = express.Router();
// var Sequelize = require('sequelize');

router.get('/', function(req, res) {
  models.User.findAll({
    include: [models.PracticeTest],
    include: [models.StudentAnswer]
  }).then(function(users) {
   console.log("It Works!")
  });
});

module.exports = router;