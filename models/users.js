'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    fullname: DataTypes.STRING,
    password: DataTypes.TEXT
  }, {});
  users.associate = function(models) {
    // associations can be defined here
    users.hasMany(models.posts);
  };
  return users;
};