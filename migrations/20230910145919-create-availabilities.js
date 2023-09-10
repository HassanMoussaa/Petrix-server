"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("availabilities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      day: {
        type: Sequelize.STRING,
      },
      start_time: {
        type: Sequelize.TIME,
      },
      end_time: {
        type: Sequelize.TIME,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addColumn("availabilities", "UserId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // The name of the referenced model
        key: "id", // The name of the referenced column
      },
      onUpdate: "CASCADE", // Update the Availability's UserId if the referenced User's id changes
      onDelete: "CASCADE", // Delete the Availability if the referenced User is deleted
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("availabilities");
  },
};
