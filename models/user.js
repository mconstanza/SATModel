'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,

    facebookID: DataTypes.STRING,
    facebookToken: DataTypes.STRING,
    facebookEmail: DataTypes.STRING,
    facebookName: DataTypes.STRING,

    googleID: DataTypes.STRING,
    googleToken: DataTypes.STRING,
    googleEmail: DataTypes.STRING,
    googleName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.StudentAnswer), {through: 'UserAnswers'}

      },
      // may need ot use instanceMethods for these
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },

      validPassword: function(password) {
        return bcrypt.compareSync(password, this.local.password);
      }
    }
  });
  return User
};
