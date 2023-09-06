module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("doctor_locations", "docId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("doctor_locations", "docId");
  },
};
