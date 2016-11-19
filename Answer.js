'use strict';
module.exports = function(sequelize, DataTypes) {
  var Answer= sequelize.define('Answer', {
    number: DataTypes.INTEGER,
    StudentAnswer: DataTypes.STRING,
    CorrectAnswer: DataTypes.STRING,
    Category: DataTypes.STRING,
    Skill: DataTypes.STRING,
    CrossTest: {type: DataTypes.STRING, 
                allowNull: true},
    Subscore: {type: DataTypes.STRING, 
                allowNull: true},
    Section: DataTypes.STRING,
    PracticeTest: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
      	
        Question.belongsToMany(models.Answer, {through: 'PracticeQuestion'}); 
      }
    }
  });
  return Question;
};