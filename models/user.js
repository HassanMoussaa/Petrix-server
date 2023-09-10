const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.DoctorLocations, {
        foreignKey: "docId",
        as: "clinicLocations",
      });

      this.belongsToMany(models.Specialties, {
        through: "User_Specialties",
        as: "specialties",
      });

      this.hasMany(models.Availability, {
        foreignKey: "id",
        as: "availabilities",
      });

      this.belongsTo(models.UserType, {
        foreignKey: "userTypeId",
        as: "userType",
      });

      this.hasMany(models.Post, {
        foreignKey: "docId",
        as: "posts",
      });

      this.hasMany(models.Pet, {
        foreignKey: "id",
        as: "pets",
      });

      this.hasMany(models.Appointment, {
        foreignKey: "id",
        as: "doctorAppointments",
      });
      this.hasMany(models.Appointment, {
        foreignKey: "id",
        as: "petOwnerAppointments",
      });

      this.hasMany(models.Like, {
        foreignKey: "id",
        as: "userLikes",
      });
      this.hasMany(models.Comment, {
        foreignKey: "id",
        as: "userComments",
      });

      this.hasMany(models.UserFollower, {
        as: "follower",
        foreignKey: "id",
      });

      this.hasMany(models.UserFollower, {
        as: "following",
        foreignKey: "id",
      });
    }
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
        unique: true,
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
