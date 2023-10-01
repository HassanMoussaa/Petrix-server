"use strict";
const bcryptjs = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;

    const doctorUsersData = [];

    for (let i = 1; i <= 50; i++) {
      const user = {
        firstName: `DoctorFirstName${i}`,
        lastName: `DoctorLastName${i}`,
        email: `drdoctor${i}@example.com`,
        password: `doctor${i}`,
        city: "Beirut",
        country: "Lebanon",
        profile: "Veterinarian",
        phone: `+9617223456${i}`,
        photoUrl: "http://54.246.63.155/images/default_profile_picture.jpg",
        userTypeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const hashedPassword = await bcryptjs.hash(user.password, saltRounds);
      user.password = hashedPassword;
      doctorUsersData.push(user);
    }

    await queryInterface.bulkInsert("users", doctorUsersData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("users", null, {});
  },
};
