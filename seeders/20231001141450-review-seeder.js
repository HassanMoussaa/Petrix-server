"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const reviewData = [];
    let reviewId = 1;

    for (let doctorId = 331; doctorId <= 380; doctorId++) {
      for (let petOwnerId = 31; petOwnerId <= 350; petOwnerId++) {
        const review = {
          body: `This is a review for doctor ${doctorId} by pet owner ${petOwnerId}`,
          rate: Math.floor(Math.random() * 5) + 1,
          petOwner_id: petOwnerId,
          doctor_id: doctorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        reviewData.push(review);
        reviewId++;
      }
    }

    await queryInterface.bulkInsert("reviews", reviewData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("reviews", null, {});
  },
};
