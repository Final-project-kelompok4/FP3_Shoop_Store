'use strict';

const { hashPassword } = require('../utils/bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const hashedPassword = await hashPassword('superadmin')
    
    await queryInterface.bulkInsert('Users', [{
      full_name: 'superadmin',
      email: 'superadmin@gmail.com',
      password: hashedPassword,
      gender: 'male',
      role: 'admin',
      balance: 0,
      createdAt: new Date,
      updatedAt: new Date
    }], {})

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Users', null, {});

  }
};
