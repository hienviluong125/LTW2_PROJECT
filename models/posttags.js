'use strict';
module.exports = (sequelize, DataTypes) => {
  const PostTags = sequelize.define('PostTags', {
    PostId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER
  }, {});
  PostTags.associate = function(models) {
    // associations can be defined here
  };
  return PostTags;
};