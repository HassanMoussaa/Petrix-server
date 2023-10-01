"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const availabilityData = [];
    let availabilityId = 1;

    for (let doctorId = 331; doctorId <= 380; doctorId++) {
      for (let day = 1; day <= 5; day++) {
        const availability = {
          day: day,
          start_time: "09:00:00",
          end_time: "18:00:00",
          UserId: doctorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        availabilityData.push(availability);
        availabilityId++;
      }
    }

    await queryInterface.bulkInsert("availabilities", availabilityData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("availabilities", null, {});
  },
};
