const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "docId",
        as: "doctor",
      });
      this.belongsTo(models.User, {
        foreignKey: "petOwnerId",
        as: "petOwner",
      });
      this.belongsTo(models.Pet, {
        foreignKey: "petId",
        as: "pet",
      });
    }
  }
  Appointment.init(
    {
      date: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Appointment",
    }
  );
  return Appointment;
};
