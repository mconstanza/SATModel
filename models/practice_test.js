'use strict';

module.exports = function(sequelize, DataTypes) {
  var PracticeTest = sequelize.define('PracticeTest', {
    name: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        PracticeTest.hasMany(models.Question),
        PracticeTest.belongsToMany(models.StudentAnswer, { through: 'StudentResponse' })
      }
    }
  });
  return PracticeTest;
};
