'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MainCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'MainCategories',
          key: 'id',
        }
      },
      SubCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SubCategories',
          key: 'id',
        }
      },
      title: {
        type: Sequelize.STRING
      },
      releaseDate: {
        type: Sequelize.DATE
      },
      shortContent: {
        type: Sequelize.STRING
      },
      isPremium: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
      },
      content: {
        type: Sequelize.TEXT
      },
      WriterId: {
        type: Sequelize.INTEGER,
      },
      thumbnail: {
        type: Sequelize.STRING
      },
      slug :{
        type:Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue:'pending'
      },
      views: {
        type:Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Posts');
  }
};