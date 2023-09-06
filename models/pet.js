"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "PetOwner",
      });

      this.hasMany(models.Appointment, {
        foreignKey: "id",
        as: "petAppointments",
      });
    }
  }
  Pet.init(
    {
      name: DataTypes.STRING,
      breed: DataTypes.STRING,
      photo_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Pet",
    }
  );
  return Pet;
};
