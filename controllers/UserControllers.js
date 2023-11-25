const { User } = require('../models')
const { formatCurrency } = require('../utils/currency')
const { generateToken } = require('../utils/jwt')
const { comparePassword } = require('../utils/bcrypt')

class UserController {

    // ENDPOINT REGISTRASI USERS
    static async registerUsers(req, res) {
        try {
            
            const {
                full_name, password, gender, email
            } = req.body

            const data = await User.create({
                full_name, password, gender, email
            })

            data.balance = formatCurrency(data.balance)

            res.status(201).json({
                user: {
                    full_name: data.full_name,
                    email: data.email,
                    gender: data.gender,
                    balance: data.balance,
                    createdAt: data.createdAt
                }
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT LOGIN USERS
    static async loginUsers(req, res) {
        try {
            
            const {
                email, password 
            } = req.body

            const data = await User.findOne({
                where: {
                    email:email
                }
            })

            if (!data) {
                throw {
                    code: 404,
                    message: 'User tidak terdaftar'
                }
            }

            const isValid = comparePassword(password, data.password)
            if (!isValid) {
                throw {
                    code: 401,
                    message: 'Password salah'
                }
            }

            const token = generateToken({
                id: data.id,
                email: data.email
            })

            res.status(200).json({ code: 200, token })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT UPDATE USERS(PUT)
    static async updateUsersPut(req, res) {
        try {
            
            const {
                full_name, email
            } = req.body

            const userData = req.userData
            
            const data = await User.update({
                full_name, email
            }, {
                where: {
                    id: userData.id
                    
                },
                returning: true
            })

            if (!data) {
                throw {
                    code: 404,
                    message: "Data tidak ada"
                }
            }

            res.status(200).json({
                code: 200,
                user: {
                    id: userData.id,
                    full_name: userData.full_name,
                    email: userData.email,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt
                }
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENPOINT TOPUP USERS
    static async topUpUsers(req, res) {
        try {
            
            const { balance } = req.body
            const userData = req.userData

            const data = await User.findByPk(userData.id)
            data.balance += balance
            await data.save()
            const formattedBalance = formatCurrency(data.balance)

            res.status(200).json({
                message: `Your balance has been successfully updated to Rp ${formattedBalance}`
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    //ENDPOINT UNTUK HAPUS USER
    static async deletedUsers(req, res) {
        try {
            
            const userData = req.userData

            const deleteUser = await User.destroy({
                where: {
                    id: userData.id
                }
            })

            res.status(200).json({ message: "Your account has been succesfully deleted" })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }

}

module.exports = UserController