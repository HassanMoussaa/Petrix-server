const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "petOwner_id",
        as: "petOwner",
      });
      this.belongsTo(models.User, {
        foreignKey: "doctor_id",
        as: "doctor",
      });
    }
  }
  Review.init(
    {
      body: Sequelize.TEXT,
      rate: {
        type: Sequelize.INTEGER,
        validate: {
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
    }
  );
  return Review;
};
