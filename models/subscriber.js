'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscribers = sequelize.define('Subscribers', {
    UserId: DataTypes.INTEGER,
    expireDate: DataTypes.DATE,
	  status: DataTypes.STRING
  }, {});
  Subscribers.associate = function(models) {
    // associations can be defined here
  };
  return Subscribers;
};