'use strict';
module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
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
      	
        Question.belongsToMany(models.PracticeTest); 
        Question.hasMany(models.StudentAnswers);
      }
    }
  });
  return Question;
};