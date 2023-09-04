'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserType extends Model {
    static associate(models) {
      
    }
  }

  UserType.init(
    {
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'UserType',
      tableName: 'userTypes', 
      timestamps: false, 
    }
  );

  return UserType;
};
