'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.bulkInsert('user_types', [
      {
        type: 'Pet Owner',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'Doctor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.bulkDelete('user_types', null, {});
  },
};
