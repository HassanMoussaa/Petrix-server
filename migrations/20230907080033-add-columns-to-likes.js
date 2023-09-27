"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("likes", "userId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
      .then(() => {
        return queryInterface.addColumn("likes", "postId", {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Posts",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        });
      });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("likes", "userId").then(() => {
      return queryInterface.removeColumn("likes", "postId");
    });
  },
};
