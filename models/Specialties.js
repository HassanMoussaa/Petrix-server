// models/Specialties.js

const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Specialties extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: "User_Specialties",
        as: "doctors",
      });
    }
  }

  Specialties.init(
    {
      doc_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      speciality: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "specialties",
      modelName: "Specialties",
    }
  );

  return Specialties;
};
