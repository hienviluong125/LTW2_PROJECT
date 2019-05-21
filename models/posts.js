'use strict';
module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define('Posts', {
    MainCategoryId: DataTypes.INTEGER,
    SubCategoryId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    releaseDate: DataTypes.DATE,
    slug: DataTypes.STRING,
    isPremium: DataTypes.BOOLEAN,
    shortContent: DataTypes.STRING,
    content: DataTypes.TEXT,
    WriterId: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    status: DataTypes.STRING,
    views: DataTypes.INTEGER
  }, {});
  Posts.associate = function (models) {
    // associations can be defined here
    Posts.belongsTo(models.SubCategories);
    Posts.belongsTo(models.MainCategories);
    Posts.belongsTo(models.Users, { foreignKey: 'WriterId' });
    Posts.hasMany(models.Comments);
    Posts.belongsToMany(models.Tags, {
      through: {
        model: models.PostTags
      },
      foreignKey: 'PostId'
    });
    Posts.hasOne(models.Notes);
  };
  
  return Posts;
};
// pending - verified - published - rejected