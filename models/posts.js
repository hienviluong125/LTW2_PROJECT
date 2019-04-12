'use strict';
module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define('Posts', {
    MainCategoryId: DataTypes.INTEGER,
    SubCategoryId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    releaseDate: DataTypes.DATE,
    shortContent: DataTypes.STRING,
    content: DataTypes.TEXT,
    WriterId: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    editorNote: DataTypes.STRING
  }, {});
  Posts.associate = function(models) {
    // associations can be defined here
    Posts.belongsTo(models.SubCategories);
    Posts.belongsTo(models.MainCategories);
  };
  return Posts;
};