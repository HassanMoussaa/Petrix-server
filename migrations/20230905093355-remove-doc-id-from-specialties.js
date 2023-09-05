"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Specialties", "doc_id");
  },

  down: async (queryInterface, Sequelize) => {
    // If needed, you can add code to revert the column removal here
  },
};
