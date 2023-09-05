// models/DoctorLocations.js

const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class DoctorLocations extends Model {
//     static associate(models) {
        
//       DoctorLocation.belongsTo(models.User, {
//       foreignKey: 'id', 
//       as: 'doctor',
// });
//     }
  }

  DoctorLocations.init(
    {
      doc_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id', 
        },
      },
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
