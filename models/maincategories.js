'use strict';
module.exports = (sequelize, DataTypes) => {
  const MainCategories = sequelize.define('MainCategories', {
    name: DataTypes.STRING
  }, {});
  MainCategories.associate = function(models) {
    // associations can be defined here
    MainCategories.hasMany(models.SubCategories);
    MainCategories.hasMany(models.Posts);
  }
    
  return MainCategories;
};