"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const commentData = [];
    let commentId = 1;

    // Loop through user IDs from 31 to 380
    for (let userId = 31; userId <= 380; userId++) {
      // Generate a post ID for each user (you can use a random post ID)
      const postId = Math.floor(Math.random() * 1000) + 1; // Assuming you have 1000 posts

      const comment = {
        body: `This is comment ${commentId} by User ${userId} on Post ${postId}`,
        userId: userId,
        postId: postId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      commentData.push(comment);
      commentId++;
    }

    await queryInterface.bulkInsert("comments", commentData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("comments", null, {});
  },
};
