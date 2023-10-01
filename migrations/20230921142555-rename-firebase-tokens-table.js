"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("firebaseTokens", "firebase_tokens");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("firebase_tokens", "firebaseTokens");
  },
};
