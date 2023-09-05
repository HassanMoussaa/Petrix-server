const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UserType extends Model {
    static associate(models) {
      this.hasMany(models.User, {
        as: "users",
      });
    }
  }

  UserType.init(
    {
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserType",
      tableName: "user_types",
      timestamps: false,
    }
  );

  return UserType;
};
