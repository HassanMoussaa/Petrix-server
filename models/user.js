'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
     
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true, 
      },
      password: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      profile: DataTypes.STRING,
      phone: DataTypes.STRING,
      photoUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
