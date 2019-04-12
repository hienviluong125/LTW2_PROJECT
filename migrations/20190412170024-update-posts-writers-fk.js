'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Posts', ['WriterId'], {
      type: 'foreign key',
      name: 'writer_fkey_constraint_name',
      references: { //Required field
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeConstraint('Posts', 'writer_fkey_constraint_name');

  }
};
