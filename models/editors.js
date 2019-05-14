'use strict';
module.exports = (sequelize, DataTypes) => {
  const Editors = sequelize.define('Editors', {
    UserId: DataTypes.INTEGER
  }, {});
  Editors.associate = function(models) {
    // associations can be defined here
    // Editors.hasMany(models.EditorCategories);
  };
  return Editors;
};