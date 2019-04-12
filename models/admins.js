'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admins = sequelize.define('Admins', {
    UserId: DataTypes.INTEGER
  }, {});
  Admins.associate = function(models) {
    // associations can be defined here
  };
  return Admins;
};