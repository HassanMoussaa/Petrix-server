"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      this.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
      });
    }
  }
  Comment.init(
    {
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: "comments",
      modelName: "Comment",
    }
  );
  return Comment;
};
