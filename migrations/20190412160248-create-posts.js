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
      content: {
        type: Sequelize.TEXT
      },
      WriterId: {
        type: Sequelize.INTEGER
      },
      thumbnail: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      editorNote: {
        type: Sequelize.STRING
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