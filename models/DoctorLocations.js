// models/DoctorLocations.js

const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DoctorLocations extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "docId",
        as: "doctor",
      });
    }
  }

  DoctorLocations.init(
    {
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
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
