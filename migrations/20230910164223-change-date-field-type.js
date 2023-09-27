module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("appointments", "date", {
      type: Sequelize.DATEONLY,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("appointments", "date", {
      type: Sequelize.DATE,
    });
  },
};
