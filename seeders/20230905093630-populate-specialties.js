"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define the list of specialties to insert
    const specialtiesData = [
      { speciality: "Cat", createdAt: new Date(), updatedAt: new Date() },
      { speciality: "Dog", createdAt: new Date(), updatedAt: new Date() },
      { speciality: "Bird", createdAt: new Date(), updatedAt: new Date() },
      { speciality: "Reptile", createdAt: new Date(), updatedAt: new Date() },
      { speciality: "Rabbit", createdAt: new Date(), updatedAt: new Date() },
      { speciality: "Rodent", createdAt: new Date(), updatedAt: new Date() },
      { speciality: "Fish", createdAt: new Date(), updatedAt: new Date() },
      { speciality: "Amphibian", createdAt: new Date(), updatedAt: new Date() },
      { speciality: "Exotic", createdAt: new Date(), updatedAt: new Date() },
    ];

    // Insert the specialties into the table
    await queryInterface.bulkInsert("specialties", specialtiesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the inserted data if needed
    await queryInterface.bulkDelete("specialties", null, {});
  },
};
