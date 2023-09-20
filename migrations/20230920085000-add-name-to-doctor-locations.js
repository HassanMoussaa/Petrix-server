module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("doctor_locations", "name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("doctor_locations", "name");
  },
};
