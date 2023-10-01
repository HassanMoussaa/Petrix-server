"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const postData = [];
    let postId = 1;

    for (let doctorId = 331; doctorId <= 380; doctorId++) {
      for (let i = 1; i <= 100; i++) {
        const post = {
          title: `PostTitle${postId}`,
          body: `This is the body of post ${postId}`,
          docId: doctorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        postData.push(post);
        postId++;
      }
    }

    await queryInterface.bulkInsert("posts", postData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("posts", null, {});
  },
};
