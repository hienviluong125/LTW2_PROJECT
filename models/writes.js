'use strict';
module.exports = (sequelize, DataTypes) => {
  const Writes = sequelize.define('Writes', {
    UserId: DataTypes.INTEGER,
    PenName: DataTypes.STRING
  }, {});
  Writes.associate = function(models) {
    // associations can be defined here
  };
  return Writes;
};