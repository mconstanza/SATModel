'use strict';

module.exports = function(sequelize, DataTypes) {
  var StudentAnswer = sequelize.define('StudentAnswer', {
      answer: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        StudentAnswer.belongsTo(models.User),
        StudentAnswer.belongsTo(models.Question),
        StudentAnswer.belongsTo(models.SubmittedTest)
      }
    }
  });
  return StudentAnswer;
};
