module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("userFollowers", "user_followers");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("user_followers", "userFollowers");
  },
};
