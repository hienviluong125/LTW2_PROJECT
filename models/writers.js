'use strict';
module.exports = (sequelize, DataTypes) => {
  const Writers = sequelize.define('Writers', {
    UserId: DataTypes.INTEGER,
    PenName: DataTypes.STRING
  }, {});
  Writers.associate = function(models) {
    // associations can be defined here
    Writers.hasMany(models.Posts);
  };
  return Writers;
};