// models/DoctorLocations.js

const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DoctorLocations extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "id",
        as: "doctor",
      });
    }
  }

  DoctorLocations.init(
    {
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      lon: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "doctor_locations",
      modelName: "DoctorLocations",
    }
  );

  return DoctorLocations;
};
