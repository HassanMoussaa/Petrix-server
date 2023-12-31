const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasOne(models.DoctorLocations, {
        foreignKey: "docId",
        as: "clinicLocations",
      });

      this.belongsToMany(models.Specialties, {
        through: "user_specialties",
        as: "specialties",
      });

      this.hasMany(models.Availability, {
        foreignKey: "UserId",
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
        foreignKey: "userId",
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
        foreignKey: "userId",
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

      this.hasMany(models.Review, {
        foreignKey: "doctor_id",
        as: "doctorReviews",
      });
      this.hasMany(models.Review, {
        foreignKey: "petOwner_id",
        as: "petOwnerReviews",
      });
      this.hasMany(models.FirebaseToken, {
        foreignKey: "user_id",
        as: "tokens",
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
