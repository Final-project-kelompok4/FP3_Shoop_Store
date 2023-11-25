'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: 'CategoryId' })
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'title harus di isi'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'price harus di isi'
        },
        isInt: {
          msg: 'price hanya di isi dengan nilai integer'
        },
        max: {
          args: [50000000],
          msg: 'price tidak boleh lebih dari 50.000.000'
        },
        min: {
          args: [0],
          msg: 'price tidak boleh kurang dari 0'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'stock harus di isi'
        },
        isInt: {
          msg: 'stuck harus di isi dengan tipe data integer'
        },
        min: {
          args: [5],
          msg: 'stock tidak boleh kurang dari 5'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};