module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Appointments", "date", {
      type: Sequelize.DATEONLY,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Appointments", "date", {
      type: Sequelize.DATE,
    });
  },
};
