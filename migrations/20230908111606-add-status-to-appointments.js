module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Appointments", "status", {
      type: Sequelize.STRING,
      defaultValue: "pending",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Appointments", "status");
  },
};
