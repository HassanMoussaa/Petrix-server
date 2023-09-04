'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('DoctorLocations', 'doctor_locations');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('doctor_locations', 'DoctorLocations');
  },
};
