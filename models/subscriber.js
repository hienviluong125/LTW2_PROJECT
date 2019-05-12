'use strict';
module.exports = (sequelize, DataTypes) => {
  const subscribers = sequelize.define('Subscribers', {
    UserId: DataTypes.INTEGER,
    expireDate: DataTypes.DATE
  }, {});
  subscribers.associate = function(models) {
    // associations can be defined here
  };
  return subscribers;
};