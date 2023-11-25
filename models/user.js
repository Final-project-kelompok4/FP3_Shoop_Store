'use strict';
const {
  Model
} = require('sequelize');

const {
  hashPassword
} = require('../utils/bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.TransactionHistory, { foreignKey: "UserId" })
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'full name tidak boleh kosong'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'format email tidak valid'
        },
        notEmpty: {
          msg: 'email tidak boleh kosong'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'password harus di isi',
        },
        len: {
          args: [6, 10],
          msg: 'panjang password harus 6 - 10 karakter'
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'gender harus di isi'
        },
        isIn: {
          args: [['male', 'female']],
          msg: 'gender hanya bisa di isi male dan female'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "customer",
      allowNull: true,
      validate: {
        isIn: {
          args: [['admin', 'customer']],
          msg: 'role hanya bisa di isi dengan admin dan costumer'
        }
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty:{
          msg: 'balance harus di isi'
        },
        isInt: {
          msg: 'balance harus di isi nilai integer'
        },
        min: {
          args: [0],
          msg : 'balance tidak boleh kurang dari 0'
        },
        max: {
          args: [100000000],
          msg: 'balance tidak boleh lebih dari 100.000.000'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: (user) => {
          const hashedPassword = hashPassword(user.password)
          user.password = hashedPassword
          user.balance = 0
        }
    }
  });
  return User;
};