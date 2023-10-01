"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const doctorLocationData = [];

    for (let doctorId = 331; doctorId <= 380; doctorId++) {
      const latitude = Math.random() * (90 - -90) + -90;
      const longitude = Math.random() * (180 - -180) + -180;

      const location = {
        latitude: latitude,
        longitude: longitude,
        docId: doctorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      doctorLocationData.push(location);
    }

    await queryInterface.bulkInsert("doctor_locations", doctorLocationData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("doctor_locations", null, {});
  },
};
