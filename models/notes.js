'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define('Notes', {
    EditorId: DataTypes.INTEGER,
    WriterId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    content: DataTypes.STRING,
    PostId: DataTypes.INTEGER
  }, {});
  Notes.associate = function(models) {
    // associations can be defined here
  };
  return Notes;
};