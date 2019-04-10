'use strict';
module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define('posts', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {});
  posts.associate = function(models) {
    // associations can be defined here
    posts.belongsTo(models.users);
  };
  return posts;
};