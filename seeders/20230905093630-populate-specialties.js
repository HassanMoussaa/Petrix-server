"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define the list of specialties to insert
    const specialtiesData = [
      { speciality: "Cat" },
      { speciality: "Dog" },
      { speciality: "Bird" },
      { speciality: "Reptile" },
      { speciality: "Rabbit" },
      { speciality: "Rodent" },
      { speciality: "Fish" },
      { speciality: "Amphibian" },
      { speciality: "Exotic" },
    ];

    // Insert the specialties into the table
    await queryInterface.bulkInsert("specialties", specialtiesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the inserted data if needed
    await queryInterface.bulkDelete("specialties", null, {});
  },
};
