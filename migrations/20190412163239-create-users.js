'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING
      },
      DoB: {
        type: Sequelize.DATE
      },
      role: {
        type: Sequelize.STRING,
      },
      resetPasswordToken : {
        type: Sequelize.STRING
      },
      resetPasswordExpires : {
        type: Sequelize.DATE,
      }
      ,
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
    return queryInterface.dropTable('Users');
  }
};