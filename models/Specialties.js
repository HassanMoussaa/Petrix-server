// models/Specialties.js

const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Specialties extends Model {
//     static associate(models) {
//      Specialty.belongsToMany(models.User, {
//      through: 'UserSpecialties', // Sequelize will create this table
//      as: 'doctors',
// });
//     }
  }

  Specialties.init(
    {
      doc_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id', 
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
