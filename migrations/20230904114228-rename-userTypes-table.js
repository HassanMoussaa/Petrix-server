'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.renameTable('userTypes', 'user_types');
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.renameTable('user_types', 'userTypes');
  }
};
