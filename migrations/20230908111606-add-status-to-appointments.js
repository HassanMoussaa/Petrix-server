module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("appointments", "status", {
      type: Sequelize.STRING,
      defaultValue: "pending",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("appointments", "status");
  },
};
