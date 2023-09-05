const { Sequelize,DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // static associate(models) {
      // User.hasMany(models.DoctorLocation, {
      // foreignKey: 'doc_id', 
      // as: 'clinicLocations',
      // });

      // User.belongsToMany(models.Specialty, {
      // through: 'UserSpecialties', // Sequelize will create this table
      // as: 'specialties',
// });
     


    // }
  }

  User.init(
    {
      firstName: {
        allowNull: false,
        type: Sequelize.STRING, 
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING, 
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING, 
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING, 
      },
      city: {
        type: Sequelize.STRING, 
      },
      country: {
        type: Sequelize.STRING, 
      },
      profile: {
        type: Sequelize.STRING, 
      },
      phone: {
        type: Sequelize.STRING, 
      },
      photoUrl: {
        type: Sequelize.STRING, 
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
