'use strict';

module.exports = function(sequelize, DataTypes) {
  var SubmittedTests = sequelize.define('SubmittedTest', {
    readingRaw: DataTypes.INTEGER,
    writingRaw: DataTypes.INTEGER,
    math1Raw: DataTypes.INTEGER,
    math2Raw: DataTypes.INTEGER,
    readingTest: DataTypes.INTEGER,
    writingTest: DataTypes.INTEGER,
    mathTest: DataTypes.DECIMAL,
    
    readingScaled: DataTypes.INTEGER,
    mathScaled: DataTypes.INTEGER,

    expressionOfIdeas: DataTypes.INTEGER,
    standardEnglishConventions: DataTypes.INTEGER,
    heartOfAlgebra: DataTypes.INTEGER,
    problemSolvingDataAnalysis: DataTypes.INTEGER,
    passportToAdvMath: DataTypes.INTEGER,
    wordsInContext: DataTypes.INTEGER,
    commandOfEvidence: DataTypes.INTEGER,
    history: DataTypes.INTEGER,
    science: DataTypes.INTEGER

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
