const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "doctor",
      });
    }
  }
  Availability.init(
    {
      day: Sequelize.INTEGER,
      start_time: Sequelize.TIME,
      end_time: Sequelize.TIME,
    },
    {
      sequelize,
      tableName: "availabilities",
      modelName: "Availability",
    }
  );
  return Availability;
};
