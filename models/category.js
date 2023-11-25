'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Product, { foreignKey: 'CategoryId' })
    }
  }
  Category.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'type harus di isi'
        }
      }
    },
    sold_product_amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: 'sold product amount harus diisi'
        },
        isInt: {
          msg: 'sold product amount harus di isi nilai integer'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
    hooks: {
      beforeCreate: (category) => {
        category.sold_product_amount = 0
      }
    }
  });
  return Category;
};