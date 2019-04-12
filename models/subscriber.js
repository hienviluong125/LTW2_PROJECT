'use strict';
module.exports = (sequelize, DataTypes) => {
  const subscriber = sequelize.define('Subscriber', {
    UserId: DataTypes.INTEGER,
    expireDate: DataTypes.DATE
  }, {});
  subscriber.associate = function(models) {
    // associations can be defined here
  };
  return subscriber;
};