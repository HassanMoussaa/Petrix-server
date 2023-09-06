"use strict";
const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "id",
        as: "doctor",
      });
    }
  }
  Post.init(
    {
      title: Sequelize.STRING,
      body: Sequelize.STRING,
    },
    {
      sequelize,
      tableName: "posts",
      modelName: "Post",
    }
  );
  return Post;
};
