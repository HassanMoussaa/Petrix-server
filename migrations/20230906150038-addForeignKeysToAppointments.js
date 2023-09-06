"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Appointments", "petId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Pets",
          key: "id",
        },
      }),

      queryInterface.addColumn("Appointments", "doctorId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      }),

      queryInterface.addColumn("Appointments", "petOwnerId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Appointments", "petId"),
      queryInterface.removeColumn("Appointments", "doctorId"),
      queryInterface.removeColumn("Appointments", "petOwnerId"),
    ]);
  },
};
