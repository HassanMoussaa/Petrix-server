module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "userTypeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "User_types",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "userTypeId");
  },
};
