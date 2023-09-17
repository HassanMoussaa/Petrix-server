const { Sequelize, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "doctorId",
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
      date: DataTypes.DATEONLY,
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      start_time: Sequelize.TIME,
      end_time: Sequelize.TIME,
    },
    {
      sequelize,
      modelName: "Appointment",
    }
  );
  return Appointment;
};
