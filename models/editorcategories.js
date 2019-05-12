'use strict';
module.exports = (sequelize, DataTypes) => {
  const EditorCategories = sequelize.define('EditorCategories', {
    SubCategoryId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  EditorCategories.associate = function(models) {
    // associations can be defined here
  };
  return EditorCategories;
};