"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("FirebaseTokens", "firebase_tokens");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("firebase_tokens", "FirebaseTokens");
  },
};
