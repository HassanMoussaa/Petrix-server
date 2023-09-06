module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("doctor_locations", "doc_id");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("doctor_locations", "doc_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    });
  },
};
