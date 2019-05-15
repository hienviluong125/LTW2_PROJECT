'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubCategories = sequelize.define('SubCategories', {
    name: DataTypes.STRING,
    MainCategoryId: DataTypes.INTEGER,
    slug: DataTypes.STRING,
  }, {});
  SubCategories.associate = function(models) {
    // associations can be defined here
    SubCategories.belongsTo(models.MainCategories);
    SubCategories.hasMany(models.Posts);
    SubCategories.belongsToMany(models.Users, {
      through: {
        model: models.EditorCategories
      },
      foreignKey: 'SubCategoryId'
    });
  };
  return SubCategories;
};