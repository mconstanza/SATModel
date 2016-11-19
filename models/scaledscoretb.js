/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('scaledscoretb', {
    rawScore: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    mathScore: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    readingScore: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    writingScore: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    expressionIdeas: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    stdEnglishConventions: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    heartOfAlebra: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    problemSolvingDataAnalysis: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    passportToAdvMath: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    wordsInContext: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    commandOfEvidence: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    history: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    science: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'scaledscoretb'
  });
};
