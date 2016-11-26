'use strict';

module.exports = function(sequelize, DataTypes) {
  var SubmittedTests = sequelize.define('SubmittedTest', {
    name: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        SubmittedTests.hasOne(models.StudentAnswer),
        SubmittedTests.belongsTo(models.User),
        SubmittedTests.belongsTo(models.PracticeTest)
      }
    }
  });
  return SubmittedTests;
};
