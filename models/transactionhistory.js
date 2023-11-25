'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionHistory.belongsTo(models.User, { foreignKey: "UserId" })
      TransactionHistory.belongsTo(models.Product, { foreignKey: "ProductId" })
    }
  }
  TransactionHistory.init({
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'quantity hanya bisa di isi dengan nilai integer'
        },
        notEmpty: {
          msg: 'quantity harus di isi'
        }
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: 'total_price harus terisi'
        },
        isInt: {
          msg: 'total price hanya bisa di isi nilai integer'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};