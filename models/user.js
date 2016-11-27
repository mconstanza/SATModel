'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING.BINARY,
    email: DataTypes.STRING,
    role: DataTypes.STRING,

    facebookID: DataTypes.STRING,
    facebookToken: DataTypes.STRING,
    facebookEmail: DataTypes.STRING,
    facebookName: DataTypes.STRING,

    googleID: DataTypes.STRING,
    googleToken: DataTypes.STRING,
    googleEmail: DataTypes.STRING,
    googleName: DataTypes.STRING,

    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.StudentAnswer), {through: 'UserAnswers'},
        User.hasMany(models.SubmittedTest), {through: 'UserSubmittedTests'}
      },
      // may need ot use instanceMethods for these
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
      }
    },

    instanceMethods: {

      validPassword: function(password) {
        console.log('this.password: ' + this.password);
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  return User;
};
