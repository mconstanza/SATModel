'use strict';

module.exports = function(sequelize, DataTypes) {
  var StudentAnswer = sequelize.define('StudentAnswer', {
      answer: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        StudentAnswer.belongsTo(models.User),
        StudentAnswer.belongsToMany(models.PracticeTest, { through: 'StudentResponse' } ),
        StudentAnswer.belongsTo(models.Question)
      }
    }
  });
  return StudentAnswer
};
