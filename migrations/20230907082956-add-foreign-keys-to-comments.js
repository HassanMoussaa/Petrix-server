module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Comments", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    });

    await queryInterface.addColumn("Comments", "postId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Posts",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Comments", "userId");
    await queryInterface.removeColumn("Comments", "postId");
  },
};
