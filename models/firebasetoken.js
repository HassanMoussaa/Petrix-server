const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FirebaseToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  FirebaseToken.init(
    {
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "FirebaseToken",
      tableName: "firebase_tokens",
    }
  );
  return FirebaseToken;
};
