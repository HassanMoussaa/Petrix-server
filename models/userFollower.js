"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserFollower extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "followingId",
        as: "following",
      });

      this.belongsTo(models.User, {
        foreignKey: "followerId",
        as: "follower",
      });
    }
  }
  UserFollower.init(
    {},
    {
      sequelize,
      tableName: "user_followers",
      modelName: "UserFollower",
    }
  );
  return UserFollower;
};
