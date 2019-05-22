'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    PostId: DataTypes.INTEGER,
    commentDate: DataTypes.DATE,
    UserId: DataTypes.INTEGER,
    commentContent: DataTypes.TEXT
  }, {});
  Comments.associate = function(models) {
    // associations can be defined here
    Comments.belongsTo(models.Users);
  };
  return Comments;
};