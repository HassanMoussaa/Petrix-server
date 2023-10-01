"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define the data for the user types
    const userTypesData = [
      {
        type: "Pet Owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Doctor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insert the data into the user_types table
    await queryInterface.bulkInsert("user_types", userTypesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("user_types", null, {});
  },
};
