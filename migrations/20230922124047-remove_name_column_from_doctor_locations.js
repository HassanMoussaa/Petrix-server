"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("doctor_locations", "name");
  },

  down: async (queryInterface, Sequelize) => {
    // If you need to revert the change, you can define the "down" migration here.
    // This would involve adding the "name" column back to the "doctor_locations" table.
  },
};
