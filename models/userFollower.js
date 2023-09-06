"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userFollower extends Model {
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
  userFollower.init(
    {},
    {
      sequelize,
      modelName: "userFollower",
    }
  );
  return userFollower;
};
