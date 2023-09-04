const { Sequelize, Model } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      
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
