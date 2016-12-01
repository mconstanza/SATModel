'use strict';

module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    number: DataTypes.INTEGER,
    answer: DataTypes.STRING,
    category: DataTypes.STRING,
    skill: DataTypes.STRING,
    crossTest: {type: DataTypes.STRING,
                allowNull: true},
    subScore: {type: DataTypes.STRING,
               allowNull: true},
    section: DataTypes.STRING,
    questionType: DataTypes.STRING,
    answerType: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Question.belongsTo(models.PracticeTest),
        Question.hasMany(models.StudentAnswer)
      }
    }
  });
  return Question;
};
