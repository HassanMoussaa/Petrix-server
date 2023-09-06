module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("posts", "docId", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("posts", "doctorId");
  },
};
