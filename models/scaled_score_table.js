/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var ScaledScoreTable = sequelize.define('ScaledScoreTable', {
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
        expressionOfIdeas: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        standardEnglishConventions: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        heartOfAlgebra: {
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
        classMethods: {
            associate: function(models) {
                ScaledScoreTable.belongsTo(models.PracticeTest)
            }
        }
    });

    return ScaledScoreTable;
};
