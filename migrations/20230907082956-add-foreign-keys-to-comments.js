module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("comments", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    });

    await queryInterface.addColumn("comments", "postId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Posts",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("comments", "userId");
    await queryInterface.removeColumn("comments", "postId");
  },
};
