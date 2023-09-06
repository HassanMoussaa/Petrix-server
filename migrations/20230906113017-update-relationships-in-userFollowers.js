module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("userFollowers", "followingId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("userFollowers", "followerId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("userFollowers", "followingId");
    await queryInterface.removeColumn("userFollowers", "followerId");
  },
};
