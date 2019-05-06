'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    email: DataTypes.STRING,
    DoB: DataTypes.DATE,
    role: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};