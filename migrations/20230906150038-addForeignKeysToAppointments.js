"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("appointments", "petId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "pets",
          key: "id",
        },
      }),

      queryInterface.addColumn("appointments", "doctorId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      }),

      queryInterface.addColumn("appointments", "petOwnerId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("appointments", "petId"),
      queryInterface.removeColumn("appointments", "doctorId"),
      queryInterface.removeColumn("appointments", "petOwnerId"),
    ]);
  },
};
