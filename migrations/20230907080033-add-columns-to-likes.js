"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("Likes", "userId", {
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
        return queryInterface.addColumn("Likes", "postId", {
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
    return queryInterface.removeColumn("Likes", "userId").then(() => {
      return queryInterface.removeColumn("Likes", "postId");
    });
  },
};
