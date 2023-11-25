const { 
    TransactionHistory, 
    User,
    Product,
    Category
} = require('../models')

const { formatCurrency } = require('../utils/currency')

class TransactionController {

    // ENDPOINT UNTUK ADD TRANSACTION
    static async addTransaction(req, res) {
        const { productId: originalProductId, quantity } = req.body
        const userId = req.userData.id

        const productId = originalProductId

        try {
            
            const product = await Product.findByPk(productId)

            if (!product) {
                throw {
                    code: 404,
                    message: "Produk tidak ada"
                }
            }

            if (product.stock < quantity) {
                throw {
                    code: 400,
                    message: "Stock tidak cukup"
                }
            }

            const user = await User.findByPk(userId)

            if (user.balance < product.price * quantity) {
                throw {
                    code: 404,
                    message: "Saldo tidak cukup"
                }
            }

            const transaction = await User.sequelize.transaction()

            try {
                
                await Product.update(
                    { stock: product.stock - quantity },
                    { where: { id: productId }, transaction }
                )

                await User.update(
                    { balance: user.balance - product.price * quantity },
                    { where: { id: userId }, transaction }
                )

                const category = await Category.findByPk(product.CategoryId);
                await Category.update(
                    { sold_product_amount: category.sold_product_amount + quantity },
                    { where: { id: product.CategoryId }, transaction }
                )

                await TransactionHistory.create(
                    {
                        quantity,
                        total_price: product.price * quantity,
                        ProductId: productId,
                        UserId: userId,
                    },
                    { transaction }
                )

                await transaction.commit()

                const productName = product.title

                const response = {
                    message: "You have successfully purchased the product",
                    transactionBill: {
                      total_price: formatCurrency(product.price * quantity),
                        quantity,
                        product_name: productName,
                    },
                }

                res.status(201).json(response)

            } catch (error) {
                res.status( error.code || 500).json(error.message)
            }

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT UNTUK GET SEMUA DATA TRANSACTION OLEH USER
    static async getTransactionByUser(req, res) {

        try {
            

            const userId = req.userData.id

            const transactions = await TransactionHistory.findAll({
                where : {
                    UserId: userId
                },
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                    },
                    { model: User, attributes: ['id', 'email', 'balance', 'gender', 'role'] }
                ]
            })

            if ((transactions.length === 0)) {
                throw {
                    code: 404,
                    message: 'transaction history tidak ada'
                }
            }

            const formattedTransactions = transactions.map((transaction) => {
                return {
                    ProductId: transaction.Product.id,
                    UserId: transaction.User.id,
                    quantity: transaction.quantity,
                    total_price: formatCurrency(transaction.total_price),
                    createdAt: transaction.createdAt,
                    updatedAt: transaction.updatedAt,
                    Product: {
                        id: transaction.Product.id,
                        title: transaction.Product.title,
                        price: formatCurrency(transaction.Product.price),
                        stock: transaction.Product.stock,
                        CategoryId: transaction.Product.CategoryId,
                    }
                }
            })

            res.status(200).json({
                transactionHistories: formattedTransactions,
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }

    }

    
    // ENDPOINT UNTUK GET TRANSACTION OLEH ADMIN
    static async getTransactionAdmin(req, res) {
        try {
            
            const transactions = await TransactionHistory.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'balance', 'gender', 'role'],
                    },
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            })

            const formattedTransactions = transactions.map((transaction) => {
                return {
                    ProductId: transaction.ProductId,
                    UserId: transaction.UserId,
                    quantity: transaction.quantity,
                    total_price: formatCurrency(transaction.total_price),
                    createdAt: transaction.createdAt,
                    updatedAt: transaction.updatedAt,
                    Product: {
                        id: transaction.Product.id,
                        title: transaction.Product.title,
                        price: formatCurrency(transaction.Product.price),
                        stock: transaction.Product.stock,
                        CategoryId: transaction.Product.CategoryId,
                    },
                    User: {
                        id: transaction.User.id,
                        email: transaction.User.email,
                        balance: formatCurrency(transaction.User.balance),
                        gender: transaction.User.gender,
                        role: transaction.User.role,
                    },
                };
            })

            res.status(200).json({
                transactionHistories: formattedTransactions,
            })
            
        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT GET DATA TRANSACTION SATU PRODUCT
    static async getTransactionById(req, res) {
        try {
            
            const { id } = req.params

            const userId = req.userData.id

            const transaction = await TransactionHistory.findByPk(id, {
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId'],
                    },
                    { 
                        model: User, 
                        attributes: ['id', 'email', 'balance', 'gender', 'role'] 
                    },
                ],
            })

            if (!transaction || transaction.UserId !== userId) {
                throw {
                    code: 404,
                    message: 'transaction tidak ditemukan'
                }
            }

            const formattedTransaction = {
                ProductId: transaction.Product.id,
                UserId: transaction.User.id,
                quantity: transaction.quantity,
                total_price: formatCurrency(transaction.total_price),
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
                Product: {
                    id: transaction.Product.id,
                    title: transaction.Product.title,
                    price: formatCurrency(transaction.Product.price),
                    stock: transaction.Product.stock,
                    CategoryId: transaction.Product.CategoryId,
                },
            }

            res.status(200).json({
                code: 200,
                transaction: formattedTransaction,
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }

}

module.exports = TransactionController