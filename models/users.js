'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    email: DataTypes.STRING,
    DoB: DataTypes.DATE
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};