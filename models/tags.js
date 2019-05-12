'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define('Tags', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
  }, {});
  Tags.associate = function(models) {
    // associations can be defined here
    Tags.belongsToMany(models.Posts,{
      through: {
        model: models.PostTags
      },
      foreignKey: 'TagId'
    });
  };
  return Tags;
};