"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
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
  Like.init(
    {},
    {
      sequelize,
      tableName: "likes",
      modelName: "Like",
    }
  );
  return Like;
};
