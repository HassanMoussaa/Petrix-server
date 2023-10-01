module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "userTypeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user_types",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "userTypeId");
  },
};
