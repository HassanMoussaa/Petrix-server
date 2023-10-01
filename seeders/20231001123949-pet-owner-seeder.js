"use strict";
const bcryptjs = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;

    const petOwnerUsersData = [];

    for (let i = 1; i <= 300; i++) {
      const user = {
        firstName: `PetOwnerFirstName${i}`,
        lastName: `PetOwnerLastName${i}`,
        email: `petowner${i}@example.com`,
        password: `petowner${i}`,
        city: "Beirut",
        country: "Lebanon",
        profile: "Pet Owner",
        phone: `+9617112345${i}`,
        photoUrl: "http://54.246.63.155/images/default_profile_picture.jpg",
        userTypeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const hashedPassword = await bcryptjs.hash(user.password, saltRounds);
      user.password = hashedPassword;
      petOwnerUsersData.push(user);
    }

    await queryInterface.bulkInsert("users", petOwnerUsersData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("users", null, {});
  },
};
