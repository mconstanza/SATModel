'use strict';

module.exports = function(sequelize, DataTypes) {
  var PracticeTest = sequelize.define('PracticeTest', {
    name: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        PracticeTest.hasMany(models.Question),
        PracticeTest.hasMany(models.StudentAnswer),
        PracticeTest.hasMany(models.SubmittedTest),
        PracticeTest.hasOne(models.ScaledScoreTable)
      }
    }
  });
  return PracticeTest;
};
