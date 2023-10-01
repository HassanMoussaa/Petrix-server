"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const petData = [];
    let petOwnerId = 31;

    for (let i = 1; i <= 1000; i++) {
      const breedId = i % 9 === 0 ? 9 : i % 9;

      const pet = {
        name: `PetName${i}`,
        breed: breedId.toString(),
        photo_url: "",
        userId: petOwnerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      petData.push(pet);

      if (i % 3 === 0) {
        petOwnerId++;
      }
    }

    await queryInterface.bulkInsert("pets", petData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("pets", null, {});
  },
};
